import { app } from '@magickml/server-core'

import { chromium } from 'playwright'
import dotenv from 'dotenv'
dotenv.config()

// check if HEADLESS=true
const headless = process.env.HEADLESS === 'true'
const muted = process.env.MUTED === 'true'

/**
 * Represents an Agent in the Upstreet multiplayer world.
 */
export class UpstreetAgent extends EventTarget {
  /**
   * @property {import('playwright').Browser|null} browser - The browser instance.
   * @property {import('playwright').Page|null} page - The page instance.
   */
  browser = null as any
  page = null as any
  ready = false
  /**
   * Connects the agent to the Upstreet multiplayer world.
   * @async
   * @returns {Promise<boolean>} Returns true if already connected; otherwise, establishes a new connection.
   * @throws Will throw an error if the connection fails.
   */
  async connect() {
    if (this.browser) {
      console.warn('Already connected to agent. Skipping connection.')
      return true
    }
    try {
      this.browser = await chromium.launch({
        headless: headless,
        args: muted ? ['--mute-audio'] : [],
      })
      this.page = await this.browser.newPage()
      await this.page.goto('https://upstreet.ai/g/')
      // define a function called engineLoaded which sets ready to true
      await this.page.exposeFunction('engineLoaded', () => {
        this.ready = true
      })
    } catch (error) {
      console.error('An error occurred while connecting:', error)
    }

    const receiveChat = ({
      playerName,
      playerId,
      command,
      commandArgument,
      message,
    }) => {
      // emit message event
      this.dispatchEvent(
        new CustomEvent('message', {
          detail: {
            playerName,
            playerId,
            command,
            commandArgument,
            message,
          },
        })
      )
    }

    await this.page.exposeFunction('receiveChat', receiveChat.bind(this))
  }

  /**
   * Disconnects the agent from the Upstreet multiplayer world.
   * @async
   */
  async disconnect() {
    if (!this.browser) {
      console.warn('Not connected to agent. Skipping disconnection.')
    }
    await this.browser.close()
    this.page = null
    this.browser = null
  }

  /**
   * Checks if the agent is connected.
   * @returns {boolean} True if connected, false otherwise.
   */
  checkConnection() {
    if (!this.browser) {
      console.warn('Not connected to agent. Skipping message.')
      return false
    }
    if (!this.page) {
      console.warn('The page was closed in the browser. Skipping message.')
      return false
    }
    if (!this.ready) {
      console.warn('The engine is not ready. Skipping message.')
      return false
    }
    return true
  }

  /**
   * Sends a message to the Upstreet multiplayer world.
   * @async
   * @param {Object} options
   * @param {string} options.command - The command to execute.
   * @param {string} [options.commandArgument] - Additional argument for the command.
   * @param {string} [options.message] - The message text.
   * @returns {Promise<void>} Resolves when the message is sent.
   */
  async sendMessage({ command, commandArgument, message }) {
    if (!this.checkConnection()) return
    await (this.page as any).evaluate(
      ({ command, commandArgument, message }) => {
        if (!globalThis.sendChat) {
          // Uncommenting this check
          console.warn(
            'The globalThis.sendChat function does not exist. Skipping message.'
          )
          return
        }
        return globalThis.sendChat({ command, commandArgument, message }) // Calling as globalThis.sendChat
      },
      { command, commandArgument, message }
    )
  }

  /**
   * Sends a speech message.
   * @async
   * @param {string} message - The speech text.
   * @returns {Promise<void>} Resolves when the speech message is sent.
   */
  async speak(message) {
    await this.sendMessage({
      command: 'SPEAK',
      message,
      commandArgument: null,
    })
  }

  /**
   * Sends an emote.
   * @async
   * @param {string} emote - The emote text.
   * @returns {Promise<void>} Resolves when the emote is sent.
   */
  async emote(emote) {
    await this.sendMessage({
      command: 'EMOTE',
      commandArgument: emote,
      message: null,
    })
  }

  /**
   * Sends a message with an emote.
   * @async
   * @param {string} emote - The emote text.
   * @param {string} message - The message text.
   * @returns {Promise<void>} Resolves when the message with emote is sent.
   */
  async sendMessageWithEmote(emote, message) {
    await this.sendMessage({
      command: 'EMOTE',
      commandArgument: emote,
      message,
    })
  }

  /**
   * Sets an emotion.
   * @async
   * @param {string} emotion - The emotion text.
   * @returns {Promise<void>} Resolves when the emotion is set.
   */
  async setEmotion(emotion) {
    await this.sendMessage({
      command: 'EMOTION',
      commandArgument: emotion,
      message: null,
    })
  }

  /**
   * Sends a message with an emotion.
   * @async
   * @param {string} message - The message text.
   * @param {string} emotion - The emotion text.
   * @returns {Promise<void>} Resolves when the message with emotion is sent.
   */
  async sendMessageWithEmotion(message, emotion) {
    await this.sendMessage({
      command: 'EMOTION',
      commandArgument: emotion,
      message,
    })
  }

  /**
   * Moves to a target. The target can be a player name, thing or id.
   * If the engine cannot find the player or thing by name or ID it will return the most similar match.
   * @async
   * @param {string} target - The target name or ID.
   * @returns {Promise<void>} Resolves when the agent moves to the target.
   * @example
   * await agent.moveTo('player1');
   * await agent.moveTo('thing1');
   * await agent.moveTo('123456');
   */
  async moveTo(target) {
    await this.sendMessage({
      message: null,
      command: 'MOVETO',
      commandArgument: target,
    })
  }

  async lookAt(target) {
    await this.sendMessage({
      command: 'LOOKAT',
      commandArgument: target,
      message: null,
    })
  }
}

export class UpstreetConnector {
  upstreetAgent: UpstreetAgent | any = null
  spellRunner
  data
  agent
  upstreet_stream_rules = ''
  localUser: any

  constructor({ spellRunner, agent }) {
    this.agent = agent
    this.agent.upstreet = this
    this.spellRunner = spellRunner
    const data = this.agent.data.data
    this.data = data

    if (!data.upstreet_enabled) {
      console.warn('Upstreet is not enabled, skipping')
      return
    }
    console.log('Upstreet enabled, initializing...')

    this.initialize({ data })
  }

  async initialize({ data }) {
    this.upstreetAgent = new UpstreetAgent()
    await this.upstreetAgent.connect()
    this.upstreetAgent.addEventListener('message', message =>
      this.handler(message)
    )
  }

  async handler(message) {
    const author = message.characterName
    const entities = [author, this.agent.name]
    const text = message.text
    const resp = await app.get('agentCommander').runSpell({
      inputs: {
        [`Input - Upstreet (Speak)`]: {
          connector: `Upstreet (Speak)`,
          content: text,
          sender: author,
          observer: this.agent.name,
          client: 'upstreet',
          channel: 'upsteet',
          agentId: this.agent.id,
          entities,
          channelType: 'upsteet',
          rawData: JSON.stringify(message),
        },
      },
      agent: this.agent,
      secrets: this.agent.secrets,
      publicVariables: this.agent.publicVariables,
      runSubspell: true,
    })
  }

  async handleSpeak(content, event) {
    await this.upstreetAgent.speak(content)
  }

  async handleEmote(emote, event) {
    await this.upstreetAgent.emote(emote)
  }

  async handleEmotion(emotion, event) {
    await this.upstreetAgent.setEmotion(emotion)
  }

  async handleMoveTo(target, event) {
    await this.upstreetAgent.moveTo(target)
  }

  async handleLookAt(target, event) {
    await this.upstreetAgent.lookAt(target)
  }

  async handleSendMessageWithEmote(content, event) {
    const [emote, message] = content.split(' ')
    await this.upstreetAgent.sendMessageWithEmote(emote, message)
  }

  async handleSendMessageWithEmotion(content, event) {
    const [emotion, message] = content.split(' ')
    await this.upstreetAgent.sendMessageWithEmotion(message, emotion)
  }

  async handleSetEmotion(content, event) {
    await this.upstreetAgent.setEmotion(content)
  }
}
