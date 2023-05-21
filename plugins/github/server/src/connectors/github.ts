import { app } from '@magickml/server-core'
import { Octokit } from '@octokit/rest'

export class GithubConnector {
  spellRunner
  data
  agent

  constructor({ spellRunner, agent }) {
    agent.github = this
    this.spellRunner = spellRunner
    const data = agent.data.data
    this.data = data
    this.agent = agent
    console.log(data)
    console.log('Github enabled, initializing...')
    this.initialize({ spellRunner, agent, data })
  }

  async initialize({ spellRunner, agent, data }) {
    if (!data.github_enabled) {
      console.warn('Github is not enabled, skipping')
    }

    if (!data.github_access_token) {
      console.warn('Github is not enabled for this agent')
    }

    const githubHandler = setInterval(async () => {
      console.log('running loop handler')
      const resp = await spellRunner.runComponent({
        inputs: {
          'Input - Github In': {
            content: 'github',
            sender: 'github',
            observer: agent.name,
            client: 'github',
            channel: 'auto',
            channelType: 'loop',
            projectId: agent.projectId,
            entities: [],
          },
        },
        agent: this.agent,
        secrets: this.agent.secrets,
        publicVariables: this.agent.publicVariables,
        app,
        runSubspell: true,
      })
      console.log('output is', resp)
    })
    agent.githubHandler = githubHandler
    console.log('Added agent to github', agent.id)
  }

  createIssue = async (
    accessToken: string,
    owner: string,
    repo: string,
    title: string,
    body: string
  ) => {
    try {
      if (
        accessToken == undefined ||
        accessToken == '' ||
        accessToken[0] != 'g'
      ) {
        console.log('github access token is invalid')
        return null
      }
      if (!owner || owner == '' || !repo || repo == '') {
        console.log('owner/repo are invalid')
        return null
      }
      if (!title || title == '' || !body) {
        console.log('title/body are invalid')
        return null
      }

      //@octokit/rest
      const octokit = new Octokit({
        auth: accessToken,
      })

      console.log(accessToken, owner, repo, title, body)
      const issue = await octokit.rest.issues.create({
        owner: owner,
        repo: repo,
        title: title,
        body: body,
      })
      console.log('issue', issue)

      return issue
    } catch (error) {
      console.error(error)
      return null
    }
  }

  async handleMessage(response, info) {
    console.log('handleMessage', response)
    const token = this.data.github_access_token
    const owner = this.data.github_repo_owner
    const repo = this.data.github_repo_name

    if (info == '') {
      console.error('info is empty')
      return []
    }

    let json = {}
    try {
      json = JSON.parse(info)
    } catch (error) {
      json = info
    }

    const res = await this.createIssue(
      token,
      owner,
      repo,
      json['title'],
      json['content']
    )

    if (!res) {
      return null
    }

    return res
  }
}
