/**
 * Convert stereo audio buffer to mono
 * @param input Buffer of stereo audio
 * @returns
 */
export function convertStereoToMono(input: Buffer): Buffer {
  const stereoData = new Int16Array(input)
  const monoData = new Int16Array(stereoData.length / 2)
  for (let i = 0, j = 0; i < stereoData.length; i += 4) {
    monoData[j] = stereoData[i]
    j += 1
    monoData[j] = stereoData[i + 1]
    j += 1
  }
  return Buffer.from(monoData)
}

export function getDurationFromMonoBuffer(buffer: Buffer): number {
  const duration = buffer.length / 48000 / 2
  return duration
}
