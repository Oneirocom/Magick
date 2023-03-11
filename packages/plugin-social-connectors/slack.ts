import { App } from '@slack/bolt'

export class slack_client {
  spellRunner: any
  settings: any
  entity: any
  haveCustomCommands: boolean
  custom_commands: any[]
  greeting: any

  app: App

  //to verify use: url/slack/events
  async createSlackClient(spellRunner: any, settings: any, entity: any) {
    if (
      !settings.slack_token ||
      !settings.slack_signing_secret ||
      !settings.slack_bot_token
    ) {
      console.log('invalid slack tokens')
      return
    }

    this.spellRunner = spellRunner
    this.settings = settings
    this.entity = entity
    this.haveCustomCommands = settings.haveCustomCommands
    this.custom_commands = settings.custom_commands
    this.greeting = settings.slack_greeting

    console.log('slack settings:', settings)
    this.app = new App({
      signingSecret: settings.slack_signing_secret,
      token: settings.slack_bot_token,
      appToken: settings.slack_token,
    })

    this.app.message(async ({ message, say }) => {
      const text = (message as any).text
      const channel = (message as any).channel
      const userId = (message as any).user
      const result = await this.app.client.users.info({
        user: userId,
      })
      const user = result.user?.name

      if (this.haveCustomCommands) {
        for (let i = 0; i < this.custom_commands.length; i++) {
          console.log(
            'command:',
            this.custom_commands[i].command_name,
            'starting_with:',
            text.startsWith(this.custom_commands[i].command_name)
          )
          if (text.startsWith(this.custom_commands[i].command_name)) {
            const _content = text
              .replace(this.custom_commands[i].command_name, '')
              .trim()
            console.log(
              'handling command:',
              this.custom_commands[i].command_name,
              'content:',
              _content
            )

            const cresponse = await this.custom_commands[i].spell_handler(
              _content,
              user,
              this.settings.slack_bot_name,
              'slack',
              channel,
              this.entity,
              []
            )

            say(cresponse)
            return
          }
        }
      }

      const response = await spellRunner(
        text,
        user,
        this.settings.slack_bot_name,
        'slack',
        channel,
        this.entity,
        [],
        'msg'
      )
      say(response)
    })

    await this.app.start(settings.slack_port)
    console.log('Slack Bolt app is running on', settings.slack_port, '!')
  }
  async destroy() {}

  prevData: any[] = []
  messageReactionUpdate(datai: any) {
    for (let i = 0; i < this.prevData.length; i++) {
      if (
        this.prevData[i].reaction === datai.reaction &&
        this.prevData[i].discord_enabled === datai.discord_enabled &&
        this.prevData[i].spell_handler === datai.spell_handler
      ) {
        return true
      }

      return false
    }
  }

  async sendMessage(channelId: string, message: string) {
    if (
      !channelId ||
      channelId?.length <= 0 ||
      !message ||
      message?.length <= 0
    ) {
      return
    }

    await this.app.client.chat.postMessage({
      channel: channelId,
      text: message,
    })
  }
}
