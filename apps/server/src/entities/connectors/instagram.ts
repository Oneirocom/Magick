/* eslint-disable no-invalid-this */
/* eslint-disable camelcase */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { IgApiClient } from 'instagram-private-api'
import { createWikipediaEntity } from './wikipedia'

export class instagram_client {
  spellHandler
  settings
  entity
  haveCustomCommands
  custom_commands

  createInstagramClient = async (spellHandler, settings, entity) => {
    this.spellHandler = spellHandler
    this.settings = settings
    this.entity = createWikipediaEntity
    this.haveCustomCommands = settings.haveCustomCommands
    this.custom_commands = settings.custom_commands

    const username = settings['instagram_username']
    const password = settings['instagram_password']
    if (!username || !password)
      return console.warn('No Instagram credentials found, skipping')

    //creates the instagram client and logs in using the credentials
    const ig = new IgApiClient()
    ig.state.generateDevice(username)
    await ig.account.login(username, password)

    setInterval(async () => {
      const inboxItems = await ig.feed.directInbox().items()
      for (const item of inboxItems) {
        const { inviter, last_permanent_item, thread_v2_id, users } = item
        if (
          last_permanent_item.item_type === 'text' &&
          !last_permanent_item.is_sent_by_viewer
        ) {
          const { text } = last_permanent_item
          const userIds = users.map(user => user.pk)

          if (this.haveCustomCommands) {
            for (let i = 0; i < this.custom_commands[i].length; i++) {
              if (text.startsWith(this.custom_commands[i].command_name)) {
                const _content = text.replace(
                  this.custom_commands[i].command_name,
                  ''
                )

                const cresponse = await this.custom_commands[i].spell_handler(
                  _content,
                  inviter.username,
                  this.settings.instagram_bot_name ?? 'Agent',
                  'instagram',
                  thread_v2_id,
                  settings.entity,
                  []
                )

                const cThread = ig.entity.directThread(userIds)
                await cThread.broadcastText(cresponse)
                return
              }
            }
          }

          const resp = await this.spellHandler(
            text,
            inviter.username,
            this.settings.instagram_bot_name ?? 'Agent',
            'instagram',
            thread_v2_id,
            settings.entity,
            [],
            'msg'
          )
          console.log('resp of spellHandler ::: ', resp)
          const thread = ig.entity.directThread(userIds)
          await thread.broadcastText(resp)
        }
      }
    }, 5000)
  }
}
