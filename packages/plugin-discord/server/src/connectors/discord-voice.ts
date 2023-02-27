import {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  AudioPlayerStatus,
  StreamType,
  NoSubscriberBehavior,
} from '@discordjs/voice'
let createReadStream;

import { tts, tts_tiktalknet } from '@magickml/server-core'

import { addSpeechEvent } from './voiceUtils/addSpeechEvent'

function removeEmojisFromString(str: string): string {
  if (!str) return ''

  return str
    .replace(
      /(?:[\u261D\u26F9\u270A-\u270D]|\uD83C[\uDF85\uDFC2-\uDFC4\uDFC7\uDFCA-\uDFCC]|\uD83D[\uDC42\uDC43\uDC46-\uDC50\uDC66-\uDC69\uDC6E\uDC70-\uDC78\uDC7C\uDC81-\uDC83\uDC85-\uDC87\uDCAA\uDD74\uDD75\uDD7A\uDD90\uDD95\uDD96\uDE45-\uDE47\uDE4B-\uDE4F\uDEA3\uDEB4-\uDEB6\uDEC0\uDECC]|\uD83E[\uDD18-\uDD1C\uDD1E\uDD1F\uDD26\uDD30-\uDD39\uDD3D\uDD3E\uDDD1-\uDDDD])(?:\uD83C[\uDFFB-\uDFFF])?|(?:[\u231A\u231B\u23E9-\u23EC\u23F0\u23F3\u25FD\u25FE\u2614\u2615\u2648-\u2653\u267F\u2693\u26A1\u26AA\u26AB\u26BD\u26BE\u26C4\u26C5\u26CE\u26D4\u26EA\u26F2\u26F3\u26F5\u26FA\u26FD\u2705\u270A\u270B\u2728\u274C\u274E\u2753-\u2755\u2757\u2795-\u2797\u27B0\u27BF\u2B1B\u2B1C\u2B50\u2B55]|\uD83C[\uDC04\uDCCF\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE1A\uDE2F\uDE32-\uDE36\uDE38-\uDE3A\uDE50\uDE51\uDF00-\uDF20\uDF2D-\uDF35\uDF37-\uDF7C\uDF7E-\uDF93\uDFA0-\uDFCA\uDFCF-\uDFD3\uDFE0-\uDFF0\uDFF4\uDFF8-\uDFFF]|\uD83D[\uDC00-\uDC3E\uDC40\uDC42-\uDCFC\uDCFF-\uDD3D\uDD4B-\uDD4E\uDD50-\uDD67\uDD7A\uDD95\uDD96\uDDA4\uDDFB-\uDE4F\uDE80-\uDEC5\uDECC\uDED0-\uDED2\uDEEB\uDEEC\uDEF4-\uDEF8]|\uD83E[\uDD10-\uDD3A\uDD3C-\uDD3E\uDD40-\uDD45\uDD47-\uDD4C\uDD50-\uDD6B\uDD80-\uDD97\uDDC0\uDDD0-\uDDE6])|(?:[#\*0-9\xA9\xAE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9\u21AA\u231A\u231B\u2328\u23CF\u23E9-\u23F3\u23F8-\u23FA\u24C2\u25AA\u25AB\u25B6\u25C0\u25FB-\u25FE\u2600-\u2604\u260E\u2611\u2614\u2615\u2618\u261D\u2620\u2622\u2623\u2626\u262A\u262E\u262F\u2638-\u263A\u2640\u2642\u2648-\u2653\u2660\u2663\u2665\u2666\u2668\u267B\u267F\u2692-\u2697\u2699\u269B\u269C\u26A0\u26A1\u26AA\u26AB\u26B0\u26B1\u26BD\u26BE\u26C4\u26C5\u26C8\u26CE\u26CF\u26D1\u26D3\u26D4\u26E9\u26EA\u26F0-\u26F5\u26F7-\u26FA\u26FD\u2702\u2705\u2708-\u270D\u270F\u2712\u2714\u2716\u271D\u2721\u2728\u2733\u2734\u2744\u2747\u274C\u274E\u2753-\u2755\u2757\u2763\u2764\u2795-\u2797\u27A1\u27B0\u27BF\u2934\u2935\u2B05-\u2B07\u2B1B\u2B1C\u2B50\u2B55\u3030\u303D\u3297\u3299]|\uD83C[\uDC04\uDCCF\uDD70\uDD71\uDD7E\uDD7F\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE02\uDE1A\uDE2F\uDE32-\uDE3A\uDE50\uDE51\uDF00-\uDF21\uDF24-\uDF93\uDF96\uDF97\uDF99-\uDF9B\uDF9E-\uDFF0\uDFF3-\uDFF5\uDFF7-\uDFFF]|\uD83D[\uDC00-\uDCFD\uDCFF-\uDD3D\uDD49-\uDD4E\uDD50-\uDD67\uDD6F\uDD70\uDD73-\uDD7A\uDD87\uDD8A-\uDD8D\uDD90\uDD95\uDD96\uDDA4\uDDA5\uDDA8\uDDB1\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA-\uDE4F\uDE80-\uDEC5\uDECB-\uDED2\uDEE0-\uDEE5\uDEE9\uDEEB\uDEEC\uDEF0\uDEF3-\uDEF8]|\uD83E[\uDD10-\uDD3A\uDD3C-\uDD3E\uDD40-\uDD45\uDD47-\uDD4C\uDD50-\uDD6B\uDD80-\uDD97\uDDC0\uDDD0-\uDDE6])\uFE0F/g,
      ''
    )
    .replace(/:(.*?):/g, '')
}

//const transcriber = new Transcriber('288916776772018')
export function initSpeechClient({
  client,
  discord_bot_name,
  agent,
  spellRunner,
  voiceProvider,
  voiceCharacter,
  languageCode,
  tiktalknet_url
}: any) {
  console.log("INSIDE INIT SPEECH")
  //let spellRunner = spellRunner
  addSpeechEvent(client, { group: 'default_' + agent.id })
  const audioPlayer = createAudioPlayer({
    behaviors: {
      noSubscriber: NoSubscriberBehavior.Play,
    },
    debug: true,
  })
  console.log("CREATING a SPEAKING EVENT LISTNER")
  client.on('speech', async msg => {
    console.log('SPEAKING')
    const content = msg.content
    const connection = msg.connection
    const author = msg.author
    const channel = msg.channel

    if(!createReadStream) {
      // dynbamically import createReadStream from fs
      const fs = await import('fs')
      console.log(process.cwd())
      createReadStream = fs.createReadStream
    }

    connection.subscribe(audioPlayer)

    if (content) {
      const entities: {
        user: string
        inConversation: boolean
        isBot: boolean
        info3d: string
      }[] = []

      try {
        for (const [memberID, member] of channel.members) {
          entities.push({
            user: member.user.username,
            inConversation: client.isInConversation(member.user.id),
            isBot: member.user.bot,
            info3d: '',
          })
        }
      } catch (e) {}

      console.log(entities)

      const fullResponse = await spellRunner.runComponent(
        {
        inputs: {},
        runData: {
            content,
            speaker: author?.username ?? 'VoiceSpeaker',
            agent: discord_bot_name,
            client: 'discord',
            channelId: channel.id,
            agentId: agent.id,
            entities: entities.map(e => e.user),
            channel: 'voice',
        },
        runSubspell: true,
      }
      )
      let response = Object.values(fullResponse)[0] as string

      if (response === undefined || !response || response.length <= 0) {
        return
      }

      response = removeEmojisFromString(response as string)

      console.log('response is', response)
      let url
      if (response) {
        if (voiceProvider === 'google') {
          console.log('discord voice tts:', response)
          // google tts
          url = await tts(response, voiceCharacter, languageCode)
        } else {
          url = await tts_tiktalknet(response, voiceCharacter, tiktalknet_url)
        }
        console.log(url)
        if (url) {
          // const url = await tts(response)
          console.log('speech url:', url)
          const audioResource = createAudioResource(createReadStream(url), {
            inputType: StreamType.Arbitrary,
            inlineVolume: true,
          })
          audioPlayer.play(audioResource)
          audioPlayer.on(AudioPlayerStatus.Playing, () => {
            console.log('Now playing')
          })
          audioPlayer.on(AudioPlayerStatus.Idle, () => {
            console.log('Finished playing')
          })
        }
      }
    }
  })
  return client
}

/**
 * Join the voice channel and start listening.
 * @param {Discord.Receiver} receiver
 * @param {Discord.TextChannel} textChannel
 */
export async function recognizeSpeech(textChannel, clientId) {
  console.log('recognizeStream')
  if (textChannel) {
    joinVoiceChannel({
      channelId: textChannel.id,
      guildId: textChannel.guild.id,
      adapterCreator: textChannel.guild.voiceAdapterCreator,
      selfDeaf: false,
      group: 'default_' + clientId,
      selfMute: false, // this may also be needed
    })
  }
}
