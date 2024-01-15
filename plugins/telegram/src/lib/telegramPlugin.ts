import Redis from 'ioredis';
import { Job } from 'bullmq';
import {
  ActionPayload,
  CoreEventsPlugin,
  WebhookEvent,
} from 'packages/server/plugin/src';

import {
  TELEGRAM_ACTIONS,
  TELEGRAM_EVENTS,
  TELEGRAM_KEY,
} from './constants'; // Adjust import path based on your project structure
import { TelegramEmitter } from './dependencies/telegramEmitter';
import TelegramEventClient from './services/telegramEventClient';
import { sendTelegramMessage } from './nodes/actions/sendTelegramMessage';
import { telegramMessageEvent } from './nodes/events/telegramMessageEvents';
import { RedisPubSub } from 'packages/server/redis-pubsub/src';
import { pluginName, pluginCredentials } from './constants';
import { TelegramClient } from './services/telegram';
import { TelegramCredentials } from './types';
import LCMClient from './services/lcmClient';



export class TelegramPlugin extends CoreEventsPlugin {
  override enabled = true;
  event: TelegramEventClient;
  nodes = [
    telegramMessageEvent,
    sendTelegramMessage,
  ];
  values = [];
  webhookEvents?: WebhookEvent[] | undefined;
  telegram: TelegramClient | undefined = undefined;
  lcmClient = new LCMClient('http://34.48.65.58:5000/predictions', this.agentId);

  constructor(connection: Redis, agentId: string, pubSub: RedisPubSub) {
    super(pluginName, connection, agentId);
    this.event = new TelegramEventClient(pubSub, agentId);
    this.meterManager.initializeMeters({});
    this.setCredentials(pluginCredentials);
    this.initializeTelegram().catch(error =>
      this.logger.error(
        `Failed to initialize Telegram Plugin for agent ${agentId}`
      )
    );
  }

  defineEvents(): void {
    for (const [messageType, eventName] of Object.entries(TELEGRAM_EVENTS)) {
      console.log('registering event', eventName);
      this.registerEvent({
        eventName,
        displayName: `Telegram ${messageType}`,
      });
    }
  }

  defineActions(): void {
    for (const [actionName] of Object.entries(TELEGRAM_ACTIONS)) {
      console.log('registering action', actionName);
      this.registerAction({
        actionName,
        displayName: `Telegram ${actionName}`,
        handler: this.handleSendMessage.bind(this),
      });
    }
  }

  getDependencies() {
    return {
      [pluginName]: TelegramEmitter,
      lcmClient: this.lcmClient,
      telegramClient: this.telegram,
      credentialsManager: this.credentialsManager,
    };
  }

  private async initializeTelegram() {
    try {
      const credentials = await this.getCredentials();
      this.telegram = new TelegramClient(
        credentials,
        this.agentId,
        this.emitEvent.bind(this)
      );

      await this.telegram.init();

      this.updateDependency(TELEGRAM_KEY, this.telegram);
    } catch (error) {
      console.error('Failed during initialization:', error);
    }
  }

  private async getCredentials(): Promise<TelegramCredentials> {
    try {
      const tokens = ['telegram-bot-token']; // Add more tokens as needed
      const [botToken] = await Promise.all(
        tokens.map(t =>
          this.credentialsManager.retrieveAgentCredentials(this.agentId, t)
        )
      );
      return { botToken };
    } catch (error) {
      console.error('Failed to retrieve credentials:', error);
      throw error;
    }
  }

  initializeFunctionalities(): void {}
  handleOnMessage() {}

  handleSendMessage(actionPayload: Job<ActionPayload>) {
    const { actionName, event } = actionPayload.data;
    const { plugin } = event;
    const eventName = `${plugin}:${actionName}`;

    if (plugin === 'Telegram') {
      this.event.sendMessage(actionPayload.data);
    } else {
      this.centralEventBus.emit(eventName, actionPayload.data);
    }
  }

  formatPayload(event, payload) {
    return payload;
  }
}
