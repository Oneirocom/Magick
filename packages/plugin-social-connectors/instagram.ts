// GENERATED 
/**
 * A class representing the Instagram client.
 */
import { IgApiClient } from 'instagram-private-api'

export class InstagramClient {
  /**
   * @property {Object} spellRunner - An object representing the spell runner.
   * @property {Object} settings - An object containing the Instagram credentials.
   * @property {string} entity - A string containing the name of the entity.
   */
  spellRunner;
  settings;
  entity;

  /**
   * @desc Method to create Instagram client and login using the provided credentials.
   * @param {Object} spellRunner - An object representing the spell runner.
   * @param {Object} settings - An object containing the Instagram credentials.
   * @param {string} entity - A string containing the name of the entity.
   */
  createInstagramClient = async (spellRunner, settings, entity) => {
    this.spellRunner = spellRunner;
    this.settings = settings;
    this.entity = entity;

    const username = settings['instagram_username'];
    const password = settings['instagram_password'];

    if (!username || !password) {
      console.warn('No Instagram credentials found, skipping');
      return;
    }

    //creates the instagram client and logs in using the credentials
    const ig = new IgApiClient();
    ig.state.generateDevice(username);
    await ig.account.login(username, password);

    setInterval(async () => {
      const inboxItems = await ig.feed.directInbox().items();

      for (const item of inboxItems) {
        const { inviter, last_permanent_item, thread_v2_id, users } = item;
        if (
          last_permanent_item.item_type === 'text' &&
          !last_permanent_item.is_sent_by_viewer
        ) {
          const { text } = last_permanent_item;
          const userIds = users.map(user => user.pk);

          const resp = await this.spellRunner(
            text,
            inviter.username,
            this.settings.instagram_bot_name ?? 'Agent',
            'instagram',
            thread_v2_id,
            settings.entity,
            [],
            'msg'
          );
          console.log('resp of spellRunner ::: ', resp);
          const thread = ig.entity.directThread(userIds);
          await thread.broadcastText(resp);
        }
      }
    }, 5000);
  }
}