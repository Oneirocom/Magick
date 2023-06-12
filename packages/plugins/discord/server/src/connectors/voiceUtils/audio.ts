// DOCUMENTED 
/**
 * @fileoverview This file contains utility functions related to audio processing.
 */

/**
 * Converts a given stereo audio buffer to mono.
 *
 * @param input - Buffer of stereo audio.
 * @returns Buffer of mono audio.
 */
export function convertStereoToMono(input: Buffer): Buffer {
  const stereoData = new Int16Array(input);
  const monoData = new Int16Array(stereoData.length / 2);

  // Combine both channels and store in monoData
  for (let i = 0, j = 0; i < stereoData.length; i += 4) {
    monoData[j++] = stereoData[i];
    monoData[j++] = stereoData[i + 1];
  }

  return Buffer.from(monoData);
}

/**
 * Calculates the duration of a given mono audio buffer.
 *
 * @param buffer - Buffer of mono audio.
 * @returns Duration of the audio in seconds.
 */
export function getDurationFromMonoBuffer(buffer: Buffer): number {
  const duration = buffer.length / 48000 / 2;
  return duration;
}