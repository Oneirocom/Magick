//@ts-ignore
import m3u8toMp4 from 'm3u8-to-mp4'
// import https from 'https'
// import downloader from 'm3u8_multi_downloader'

export async function convertToMp4(hls: string, output: string) {
  console.log(
    'CONVERTING-----------------------------------------------------------'
  )
  const converter = new m3u8toMp4()
  await converter.setInputFile(hls).setOutputFile(output).start()
  console.log(
    'CONVERTED-----------------------------------------------------------'
  )
}
