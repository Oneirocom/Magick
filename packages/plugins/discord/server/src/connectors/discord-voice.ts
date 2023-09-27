// DOCUMENTED
import {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  NoSubscriberBehavior,
  getVoiceConnection,
  AudioPlayerStatus,
} from '@discordjs/voice'
import { app } from 'server/core'
import { addSpeechEvent } from './voiceUtils/addSpeechEvent'

/**
 * Initialize the speech client and set up event listeners.
 * @param {Object} options - The options object.
 * @return {Object} Return discord client.
 */
export function initSpeechClient(options: {
  client: any
  agent: any
  spellRunner: any
}) {
  const { client, agent } = options

  // Add speech event to the client.
  addSpeechEvent(client, { group: 'default_' + agent.id })

  const audioPlayer = createAudioPlayer({
    behaviors: {
      noSubscriber: NoSubscriberBehavior.Play,
    },
    debug: true,
  })

  client.on('speech', async msg => {
    const { content, connection, author, channel } = msg
    connection.subscribe(audioPlayer)

    console.log('speech handling')

    if (!content)
      return console.error('No content in speech message', JSON.stringify(msg))
    const entities: any[] = []
    try {
      for (const [, member] of channel.members) {
        entities.push({
          user: member.user.username,
        })
      }
    } catch (e) {
      console.log('error getting members', e)
    }

    console.log('running component')

    console.log('content is', content)

    console.log('msg is', msg)

    // Run spell and collect response.
    await app.get('agentCommander').runSpell({
      agent,
      inputs: {
        'Input - Discord (Voice)': {
          connector: 'Discord (Voice)',
          content,
          sender: author?.username ?? 'VoiceSpeaker',
          observer: agent.name,
          client: 'discord',
          channel: channel.id,
          agentId: agent.id,
          entities: entities.map((e: { user }) => e.user),
          channelType: 'voice',
          rawData: JSON.stringify({}),
        },
      },
      spellId: agent.rootSpellId,
      agentId: agent.id,
      secrets: agent.secrets ?? {},
      publicVariables: agent.publicVariables ?? {},
      runSubspell: true,
    })
    console.log('component ran')
  })

  client.voiceFunctions = {
    joinVoiceChannel,
    getVoiceConnection,
  }

  return client
}

export async function handleVoiceResponse({ output, agent, event }) {
  if (!output || output === '')
    return agent.warn('No output to send to discord')

  console.log('handling voice response')
  const discordClient = agent?.discord?.client

  console.log('discordClient', discordClient)

  // TODO: Get the the voice channel by id (event.channel is the id)
  const voiceChannel = discordClient.channels.cache.get(event.channel)

  console.log('voiceChannel', voiceChannel)

  // get the guild
  const guild = voiceChannel.guild

  console.log('guild', guild)

  const voiceConnection = getVoiceConnection(guild.id, 'default_' + agent.id)

  console.log('voiceConnection', voiceConnection)
  if (!voiceConnection) {
    console.error(
      `The bot is not in the voice channel of the guild ${guild.id}`
    )
    return
  }

  // output is a readable stream object
  const resource = createAudioResource(output)
  console.log('playing audio')

  const player = createAudioPlayer()

  player.play(resource)

  console.log('played audio')

  player.on('error', error => {
    console.error(`Error in audio player: ${error.message}`)
  })

  console.log('subscribing to voice connection')

  voiceConnection.subscribe(player)
  console.log('subscribed')

  // on idle, log finished
  player.on(AudioPlayerStatus.Idle, async () => {
    console.log('Finished playing!')
    const fs = await import('fs')
    // delete any files in fs older than 2 hours
    const files = fs.readdirSync('./files')
    files.forEach(file => {
      if (file.includes('mp3')) {
        const { birthtime } = fs.statSync(`./files/${file}`)
        const now = new Date()
        const diff = now.getTime() - birthtime.getTime()
        const hours = Math.floor(diff / 1000 / 60 / 60)
        if (hours > 2) {
          fs.unlinkSync(`./files/${file}`)
        }
      }
    })
  })
}

export async function stopSpeechClient(textChannel, clientId) {
  let connection
  if (textChannel) {
    connection = joinVoiceChannel({
      channelId: textChannel.id,
      guildId: textChannel.guild.id,
      adapterCreator: textChannel.guild.voiceAdapterCreator,
      selfDeaf: false,
      group: 'default_' + clientId,
      selfMute: false, // this may also be needed
    })
  }
  connection.destroy()
}
/**
 * Join the voice channel and start listening to voice transcriptions.
 * @param {Discord.TextChannel} textChannel - Text channel to join.
 * @param {string} clientId - Client ID of the application.
 */
export async function recognizeSpeech(textChannel: any, clientId: string) {
  console.log('recognizeStream')
  let connection
  if (textChannel) {
    connection = joinVoiceChannel({
      channelId: textChannel.id,
      guildId: textChannel.guild.id,
      adapterCreator: textChannel.guild.voiceAdapterCreator,
      selfDeaf: false,
      group: 'default_' + clientId,
      selfMute: false, // this may also be needed
    })
  }
  return connection
}
