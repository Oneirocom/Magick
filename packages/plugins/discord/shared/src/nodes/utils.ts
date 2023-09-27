import { Application } from '@feathersjs/koa/lib'
import { SpellRunner } from 'shared/core'
import TaskCreation from './spells/TaskCreation.spell'
import TaskExecution from './spells/TaskExecution.spell'
import TaskReprioritization from './spells/TaskReprioritization.spell'
export async function getChannelFromMessage(
  message: any,
  discord: any
): Promise<any> {
  let messageOBJ
  let latestTimestamp = 0
  for (const [, channel] of discord.client.channels.cache) {
    // Check if the channel is a text channel
    if (channel.type == 0) {
      // Fetch the messages in the channel
      const messages = await channel.messages.fetch()
      // Sort the messages in descending order based on their timestamps
      const sortedMessages = messages.sort(
        (a, b) => b.createdTimestamp - a.createdTimestamp
      )
      // Find the most recent message that matches the message content
      const recentMessage = sortedMessages.find(msg => msg.content === message)
      if (recentMessage && recentMessage.createdTimestamp > latestTimestamp) {
        messageOBJ = recentMessage
        latestTimestamp = recentMessage.createdTimestamp
      }
    }
  }
  return messageOBJ
}

export async function getLoadSpell(
  name: string,
  agent: any,
  app: Application
): Promise<SpellRunner | undefined> {
  let spell
  console.log('app is', app)
  switch (name) {
    case 'TaskCreation':
      spell = TaskCreation
      break
    case 'TaskReprioritization':
      spell = TaskReprioritization
      break
    case 'TaskExecution':
      spell = TaskExecution
      break
    default:
      break
  }
  if (!spell) return
  const runner = (await agent?.spellManager.load(
    spell,
    true
  )) as unknown as SpellRunner
  return runner
}

export async function runSpell(
  spellrun: SpellRunner,
  content: string,
  agent: any,
  app: Application
): Promise<any> {
  const response = await app.get('agentCommander').runSpell({
    inputs: {
      'Input - Discord (Text)': {
        connector: 'Discord (Text)',
        content: content,
        sender: ' message.author.id',
        observer: ' message.author.username',
        client: 'discord',
        channel: 'message.channel.id',
        agentId: 'agent.id',
        entities: 'entities.map(e => e.user)',
        channelType: 'msg',
      },
    },
    agent: agent,
    agentId: agent.id,
    spellId: agent.rootSpellId,
    secrets: agent.secrets,
    publicVariables: agent.publicVariables,
    runSubspell: true,
    app,
  })
  return response
}

export function parseTasks(output) {
  const tasks = output.split('\n').filter(line => /^\d+\..*/.test(line))
  return tasks.map(task => {
    const match = /^\d+/.exec(task)
    const task_id = match ? parseInt(match[0]) : null
    const task_desc = task.split('.')[1].trim()
    return { task_id, task: task_desc }
  })
}

export function popTask(tasks) {
  if (tasks.length === 0) {
    return null
  }
  return tasks.shift()
}

export function parseTasksToArray(output: string): string[] {
  const taskList = output.split('\n').slice(3) // Split the output by newline and remove the first three elements

  // Remove the task numbers and return the remaining strings
  return taskList.map(task => task.replace(/^\d+\.\s/, ''))
}

export function addTask(task, tasksList) {
  // Extract the task ID of the last task in the list
  const lastTaskId =
    tasksList.length > 0 ? tasksList[tasksList.length - 1].task_id : 0

  // Create a new task object with a unique task ID
  const newTask = {
    task_id: lastTaskId + 1,
    task: task.trim(),
  }

  // Add the new task to the tasks list
  tasksList.push(newTask)

  // Return the updated tasks list
  return tasksList
}

export function addResults(result, task, resultList) {
  const lastResultId =
    resultList.length > 0 ? resultList[resultList.length - 1].result_id : 0
  const newResult = {
    result_id: lastResultId + 1,
    sentences: result.trim(),
    task: task,
  }
  resultList.push(newResult)
  return resultList
}
export function listTasks(tasks) {
  return tasks.map(task => task.task)
}

export async function createTasks(
  objective: string,
  task_description: string,
  result: string,
  incomplete_tasks: string,
  agent: any,
  app: Application
): Promise<Array<string>> {
  const content = `{
        "objective": "${objective}",
        "result": "${result}",
        "task_description": "${task_description}",
        "incomplete_tasks": "${incomplete_tasks}"
      }`

  try {
    const taskspell = await getLoadSpell(
      'TaskCreation',
      agent as any,
      app as unknown as Application
    )
    const results = await runSpell(
      taskspell as SpellRunner,
      content,
      agent as any,
      app as unknown as Application
    )
    return parseTasksToArray(results.Output)
  } catch (error) {
    console.log(error)
    return []
  }
}

export async function taskReprioritization(
  next_task_id: string,
  objective: string,
  task_array: Array<string>,
  agent: any,
  app: Application
) {
  const content = `{
        "next_task_id": "${next_task_id}",
        "objective": "${objective}",
        "task_names": "${task_array.join()}"
      }`

  try {
    const taskspell = await getLoadSpell(
      'TaskReprioritization',
      agent as any,
      app as unknown as Application
    )
    const results = await runSpell(
      taskspell as SpellRunner,
      content,
      agent as any,
      app as unknown as Application
    )
    return parseTasks(results.Output)
  } catch (error) {
    console.log(error)
    return []
  }
}

export async function taskCompletion(
  task: string,
  context: string,
  objective: string,
  agent: any,
  app: Application
) {
  const content = `{
        "task": "${task}",
        "context": "${context}",
        "objective": "${objective}"
      }`

  console.log('CONTENT', content)
  try {
    const taskspell = await getLoadSpell(
      'TaskExecution',
      agent as any,
      app as unknown as Application
    )
    const results = await runSpell(
      taskspell as SpellRunner,
      content,
      agent as any,
      app as unknown as Application
    )
    return results.Output
  } catch (error) {
    console.log(error)
    return
  }
}

interface Data {
  result_id: number
  task: string
  sentences: string
}

export function findSimilarSentences(
  data: Data[],
  query: string,
  k: number
): Data[] {
  // Combine all sentences into a single text block
  const sentences = data.map(d => d.sentences).join(' ')

  // Create a dictionary to hold the term frequency of each word in the query
  const queryTf: Record<string, number> = {}
  query.split(' ').forEach(word => {
    queryTf[word] = (queryTf[word] || 0) + 1
  })

  // Calculate the inverse document frequency of each word in the text
  const idf: Record<string, number> = {}
  sentences.split(' ').forEach(word => {
    if (idf[word]) {
      idf[word]++
    } else {
      idf[word] = 1
    }
  })
  Object.keys(idf).forEach(word => {
    idf[word] = Math.log(data.length / idf[word])
  })

  // Create a matrix of the term frequency of each word in each sentence
  const tfMatrix: Record<string, number>[] = []
  data.forEach(d => {
    const tf: Record<string, number> = {}
    d.sentences.split(' ').forEach(word => {
      tf[word] = (tf[word] || 0) + 1
    })
    tfMatrix.push(tf)
  })

  // Calculate the cosine similarity between each sentence and the query
  const similarityScores: { index: number; score: number }[] = []
  for (let i = 0; i < data.length; i++) {
    const tf = tfMatrix[i]
    let dotProduct = 0
    let queryMagnitude = 0
    let sentenceMagnitude = 0
    Object.keys(tf).forEach(word => {
      const tfIdf = tf[word] * idf[word]
      dotProduct += tfIdf * (queryTf[word] || 0)
      queryMagnitude += tfIdf ** 2
      sentenceMagnitude += tfIdf ** 2
    })
    queryMagnitude = Math.sqrt(queryMagnitude)
    sentenceMagnitude = Math.sqrt(sentenceMagnitude)
    const similarityScore = dotProduct / (queryMagnitude * sentenceMagnitude)
    similarityScores.push({ index: i, score: similarityScore })
  }

  // Sort the sentences by their similarity score and return the top k
  similarityScores.sort((a, b) => b.score - a.score)
  const topK: Data[] = []
  for (let i = 0; i < k && i < similarityScores.length; i++) {
    const dataIndex = similarityScores[i].index
    topK.push(data[dataIndex])
  }
  return topK
}
