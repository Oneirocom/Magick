// DOCUMENTED 
/**
 * Represents the speech recognition function that can be custom implemented and specified in the [[DiscordSROptions]].
 * This function will be called when creating a [[DiscordSR]] object.
 *
 * @param audioBuffer - The audio buffer to be processed for speech recognition.
 * @param options - Optional parameters including language and API key.
 * @returns A Promise resolving to the recognized text string.
 */
export interface SpeechRecognition {
  (
    audioBuffer: Buffer,
    options?: { lang?: string; key?: string }
  ): Promise<string>
}

/**
 * Interface for specifying the options that will be passed to the [[speechRecognition]] function.
 */
export interface SpeechOptions {
  // Optional group identifier.
  group?: string
  // Optional language for speech recognition.
  lang?: string
  // Optional custom speech recognition function.
  speechRecognition?: SpeechRecognition
  // Optional API key for speech recognition services.
  key?: string
  /**
   * If true (default), bot messages will be ignored.
   * Set to false to recognize bot messages as well.
   */
  ignoreBots?: boolean
}