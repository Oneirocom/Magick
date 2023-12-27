import { Client, Events, ClientOptions } from 'discord.js'
import { ReacordDiscordJs } from 'reacord'

// const options: ClientOptions = {
//     intents: ['Guilds', 'GuildMessages'],
//   }

//   const client = new Client(options)
//   const reacord = new ReacordDiscordJs(client)

//   client.once(Events.ClientReady, () => {
//     console.log('Ready!')
//   })

//   await client.login(process.env.BOT_TOKEN)

//   c

type EventPayload<T> = T
const ON_DISCORD_MESSAGE = 'onDiscordMessage'

type DiscordCredentials = {
  token: string
  signingSecret: string
  appToken: string
}

const SLACK_DEVELOPER_MODE = true

const options: ClientOptions = {
  intents: ['Guilds', 'GuildMessages'],
}

export class DiscordClient {
  private discord: Client | undefined = undefined
  private reacord: ReacordDiscordJs | undefined = undefined

  constructor(
    private credentials: DiscordCredentials,
    private agentId: string
  ) {
    this.discord = new Client(options)
    this.reacord = new ReacordDiscordJs(this.discord)

    this.discord.once(Events.ClientReady, () => {
      console.log('Ready!')
    })
  }

  async initialize() {
    this.validateCredentials(this.credentials)
    await this.init(this.credentials)
  }

  private validateCredentials(credentials: DiscordCredentials) {
    if (false) {
      throw new Error(
        `Missing required Slack credentials: ${[
          'token',
          'signingSecret',
          'appToken',
        ]
          .filter(key => !credentials[key])
          .join(', ')}`
      )
    }
  }

  private async init(credentials: Record<string, string | undefined>) {}

  getClient() {
    return this.discord
  }

  setupListeners(agentId: string) {}
}
