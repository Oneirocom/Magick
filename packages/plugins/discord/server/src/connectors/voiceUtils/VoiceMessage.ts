// DOCUMENTED 
import { VoiceConnection } from '@discordjs/voice';
import {
  Client,
  Guild,
  GuildMember,
  StageChannel,
  User,
  VoiceChannel,
} from 'discord.js';
import wav from 'wav';

/**
 * Interface for voice message data.
 */
export interface VoiceMessageData {
  duration: number;
  audioBuffer: Buffer;
  content?: string;
  error?: Error;
  connection: VoiceConnection;
  author: User;
}

/**
 * Class representing a voice message.
 */
export default class VoiceMessage {
  channel: VoiceChannel | StageChannel;
  content?: string;
  author: User;
  duration: number;
  audioBuffer: Buffer;
  client: Client;
  error?: Error;
  connection: VoiceConnection;

  /**
   * Create a new VoiceMessage.
   *
   * @param {object} params - The parameters for the constructor.
   * @param {Client} params.client - The Discord client.
   * @param {VoiceMessageData} params.data - The voice message data.
   * @param {VoiceChannel | StageChannel} params.channel - The voice or stage channel.
   */
  constructor({
    client,
    data,
    channel,
  }: {
    client: Client;
    data: VoiceMessageData;
    channel: VoiceChannel | StageChannel;
  }) {
    this.client = client;
    this.channel = channel;
    this.author = data.author;
    this.audioBuffer = data.audioBuffer;
    this.connection = data.connection;
    this.duration = data.duration;
    this.content = data?.content;
    this.error = data?.error;
  }

  /**
   * Save the voice message to a .wav file.
   *
   * @param {string} filename - The output file path.
   */
  saveToFile(filename: string): void {
    const outputFile = new wav.FileWriter(filename, {
      sampleRate: 48000,
      channels: 1,
    });
    outputFile.write(this.audioBuffer);
    outputFile.end();
  }

  /**
   * Get the GuildMember associated with this voice message.
   *
   * @returns {GuildMember | undefined} The GuildMember or undefined if not found.
   */
  get member(): GuildMember | undefined {
    return this.guild.members.cache.get(this.author.id);
  }

  /**
   * Get the Guild associated with this voice message.
   *
   * @returns {Guild} The Guild of the voice message.
   */
  get guild(): Guild {
    return this.channel.guild;
  }
}