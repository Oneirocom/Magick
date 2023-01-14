/**
 * Speech recognition function, you can create your own and specify it in [[DiscordSROptions]], when creating [[DiscordSR]] object.
 *
 * All options that you pass to [[DiscordSR]] constructor, will be later passed to this function.
 */
export interface SpeechRecognition {
  (
    audioBuffer: Buffer,
    options?: { lang?: string; key?: string }
  ): Promise<string>
}

/**
 * Options that will be passed to [[speechRecognition]] function
 */
export interface SpeechOptions {
  group?: string
  lang?: string
  speechRecognition?: SpeechRecognition
  key?: string
  /**
   * Defaults to true
   */
  ignoreBots?: boolean
}
