/* eslint-disable no-param-reassign */
/* eslint-disable require-await */
/* eslint-disable no-empty */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable camelcase */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { launch } from 'puppeteer-stream'
import Xvfb from 'xvfb'

import { detectOsOption } from '../../server/src/entities/connectors/utils'
import { getAudioUrl } from '../../server/src/routes/getAudioUrl'
import { tts } from '../../server/src/systems/googleTextToSpeech'
import { tts_tiktalknet } from '../../server/src/systems/tiktalknet'
import { removeEmojisFromString } from '../../server/src/utils/utils'

export class zoom_client {
  ent = null

  async createZoomClient(spellHandler, settings, entity) {
    try {
      const ent = {}
      ent.xvfb = new Xvfb()
      this.ent = ent
      await ent.xvfb.start(async function (err, xvfbProcess) {
        if (err) {
          console.log(err)
          ent.xvfb.stop(function (_err) {
            if (_err) console.log(_err)
          })
        }

        console.log('started virtual window')
        ent.zoomObj = new zoom(spellHandler, settings, entity)
        await ent.zoomObj.init()
      })
    } catch (e) {
      console.log('createZoomClient error:', e)
    }
  }
  destroy() {
    if (this.ent) {
      if (this.ent.zoomObject && this.ent.zoomObject !== undefined) {
        this.ent.zoomObject.destroy()
        this.ent.zoomObject = null
      }

      if (this.ent.xvfb && this.ent.xvfb !== undefined) {
        this.ent.xvfb.stop()
        this.ent.xvfb = null
      }
    }
  }
  destroy() {}
}

export class zoom {
  spellHandler
  settings
  entity

  fakeMediaPath

  browser
  page
  socket

  constructor(spellHandler, settings, entity) {
    this.spellHandler = spellHandler
    this.settings = settings
    this.entity = entity
  }

  async init() {
    const options = {
      headless: false,
      ignoreHTTPSErrors: true,
      devtools: true,
      args: [
        '--use-fake-ui-for-media-stream',
        '--use-fake-device-for-media-stream',
        '--disable-web-security',
        '--autoplay-policy=no-user-gesture-required',
        '--ignoreHTTPSErrors: true',
      ],
      defaultViewport: {
        width: 1920,
        height: 1080,
      },
      ...detectOsOption(),
    }
    console.log(JSON.stringify(options))

    this.browser = await launch(options)
    this.page = await this.browser.newPage()
    this.page.on('console', log => {
      if (
        log._text.includes('color:green') ||
        log._text.includes('clib state')
      ) {
        return
      }

      console.log(log._text)
    })

    this.page.setViewport({ width: 0, height: 0 })
    await this.page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36'
    )
    await this.navigate(this.settings.zoom_invitation_link)
    await this.delay(20000)
    await this.catchScreenshot()
    await this.clickElementById('button', 'onetrust-accept-btn-handler')
    await this.catchScreenshot()
    await this.delay(500)
    await this.typeMessage('inputname', this.settings.zoom_bot_name, false)
    await this.clickElementById('button', 'joinBtn')
    await this.delay(20000)

    await this.clickElementById('button', 'wc_agree1')
    await this.delay(20000)
    try {
      await this.typeMessage(
        'inputpasscode',
        this.settings.zoom_password,
        false
      )
      await this.clickElementById('button', 'joinBtn')
      await this.delay(20000)
    } catch (ex) {}

    await this.clickElementById('button', 'liveTranscriptionPermissionMenu')
    await this.catchScreenshot()
    const linkHandlers = await this.page.$x(
      "//a[contains(text(), 'Show Subtitle')]"
    )
    if (linkHandlers.length > 0) {
      await linkHandlers[0].evaluate(b => b.click())
    } else {
      console.log('Link not found')
    }

    await this.clickElementById('button', 'liveTranscriptionPermissionMenu')
    await this.catchScreenshot()

    await this.clickElementById('button', 'moreButton')
    const participantsDiv = await this.page.$x(
      "//a[contains(text(), 'Participants')]"
    )
    if (participantsDiv.length > 0)
      await participantsDiv[0].evaluate(b => b.click())
    const meetingHost = await this.page.evaluate(async () => {
      // Get the element containing the details of the host of the meeting
      const el = document.getElementById('participants-list-1')
      const displayName = el?.querySelector('.participants-item__display-name')
      return displayName?.textContent
    })
    await new Promise(resolve => setTimeout(resolve, 5000))
    setInterval(async () => {
      try {
        let text = await this.page.evaluate(async () => {
          const el = document.getElementById('live-transcription-subtitle')
          return el?.textContent
        })
        console.log('TRANSCRIPTION VALUE:', text)
        console.log('lastMessage:', this.lastMessage)
        console.log('lastResponse:', this.lastResponse)

        text = text?.toLowerCase()?.trim()
        if ((text && text !== undefined) || text?.length <= 0) {
          if (
            (this.lastResponse && text.includes(this.lastResponse)) ||
            (this.lastMessage && text.includes(this.lastMessage))
          ) {
            return
          }

          if (text.includes(this.lastMessage)) {
            text = text.replace(this.lastMessage, '')
            if (text.length <= 0) {
              return
            }
          }

          this.lastMessage = text
          console.log('spellHandler:', this.spellHandler)
          let response = await this.spellHandler(
            text,
            meetingHost ?? 'User',
            this.settings.zoom_bot_name ?? 'Agent',
            'zoom',
            this.settings.zoom_invitation_link,
            this.entity,
            [],
            'msg'
          )
          const tempResp = response
          console.log('RESP:', response)
          response = removeEmojisFromString(response)
          const temp = response
          if (this.settings.voice_provider === 'google') {
            const fileId = await tts(response as string)
            const url =
              (process.env.FILE_SERVER_URL?.endsWith('/')
                ? process.env.FILE_SERVER_URL
                : process.env.FILE_SERVER_URL + '/') + fileId
            response = url
          } else if (this.settings.voice_provider === 'uberduck') {
            const url = await getAudioUrl(
              process.env.UBER_DUCK_KEY as string,
              process.env.UBER_DUCK_SECRET_KEY as string,
              this.settings.voice_character,
              response as string
            )
            response = url
          } else {
            const fileId = await tts_tiktalknet(
              response,
              this.settings.voice_character,
              this.settings.tiktalknet_url
            )
            const url =
              (process.env.FILE_SERVER_URL?.endsWith('/')
                ? process.env.FILE_SERVER_URL
                : process.env.FILE_SERVER_URL + '/') + fileId
            response = url
          }
          try {
            await this.playAudio(response)
            this.lastResponse = tempResp.toLowerCase()

            await new Promise(resolve => setTimeout(resolve, 4000))
            await this.clickElementById('button', 'audioOptionMenu')
            await this.catchScreenshot()
            const linkHandlers1 = await this.page.$x(
              "//a[contains(text(), 'Same as System')]"
            )
            if (linkHandlers1.length > 0) {
              await linkHandlers1[0].evaluate(btn => btn.click())
              await linkHandlers1[1].evaluate(btn => btn.click())
            } else {
              console.log('Link not found')
            }
          } catch (e) {
            console.log('error in init ::: ', e)
          }
        }
      } catch (e) {
        console.log('voice error:', e)
      }
    }, 5000)
  }

  destroy() {
    if (this.page) {
      this.page.close()
      this.page = null
    }
    if (this.browser) {
      this.browser.close()
      this.browser = null
    }
  }

  lastMessage = ''
  lastResponse = ''

  async clickElementById(elemType, id) {
    await this.clickSelectorId(elemType, id)
  }

  async playAudio(audioUrl) {
    console.log('playingAudio:', audioUrl)
    await this.page.evaluate(async url => {
      const audio = document.createElement('audio')
      audio.setAttribute('src', url)
      audio.setAttribute('crossorigin', 'anonymous')
      audio.setAttribute('controls', '')
      audio.oncanplay = async () => {
        audio.play()
      }
      audio.onplay = function () {
        console.log('audio on play')
        const stream = audio.captureStream()
        navigator.mediaDevices.getUserMedia
        navigator.mediaDevices.getUserMedia = async function () {
          console.log('get user media')
          return stream
        }
      }
      document.querySelector('body').appendChild(audio)
    }, audioUrl)
    try {
      await this.clickElementById('button', 'audioOptionMenu')
      await this.catchScreenshot()
      const linkHandlers = await this.page.$x(
        "//a[contains(text(), 'Fake Audio Input 1')]"
      )
      if (linkHandlers.length > 0) {
        await linkHandlers[0].evaluate(btn => btn.click())
      } else {
        console.log('Link not found')
      }

      await this.clickElementById('button', 'audioOptionMenu')
      await this.catchScreenshot()
      const linkHandlers2 = await this.page.$x(
        "//a[contains(text(), 'Fake Audio Output 1')]"
      )
      if (linkHandlers2.length > 0) {
        await linkHandlers2[0].evaluate(btn => btn.click())
      } else {
        console.log('Link not found')
      }
    } catch (e) {
      console.log('error in playAudio ::: ', e)
    }
    this.catchScreenshot()
  }

  async clickSelectorId(selector, id) {
    console.log(`Clicking for a ${selector} matching ${id}`)

    await this.page.evaluate(
      (selector, id) => {
        const matches = Array.from(document.querySelectorAll(selector))
        const singleMatch = matches.find(button => button.id === id)
        let result
        if (singleMatch && singleMatch.click) {
          console.log('normal click')
          result = singleMatch.click()
        }
        if (singleMatch && !singleMatch.click) {
          console.log('on click')
          result = singleMatch.dispatchEvent(
            new MouseEvent('click', { bubbles: true })
          )
        }
        if (!singleMatch) {
          console.log('event click', matches.length)
          if (matches.length > 0) {
            const m = matches[0]
            result = m.dispatchEvent(new MouseEvent('click', { bubbles: true }))
          }
        }
      },
      selector,
      id
    )
  }

  async clickElementByClass(elemType, classSelector) {
    await this.clickSelectorClassRegex(elemType || 'button', classSelector)
  }

  async clickSelectorClassRegex(selector, classRegex) {
    console.log(`Clicking for a ${selector} matching ${classRegex}`)

    await this.page.evaluate(
      (selector, classRegex) => {
        classRegex = new RegExp(classRegex)
        const buttons = Array.from(document.querySelectorAll(selector))
        const enterButton = buttons.find(button =>
          Array.from(button.classList).some(c => classRegex.test(c))
        )
        if (enterButton) enterButton.click()
      },
      selector,
      classRegex.toString().slice(1, -1)
    )
  }

  async navigate(url, searchParams = undefined) {
    if (!this.browser) {
      try {
        await this.init()
      } catch (e) {
        console.log('error in init:', e)
      }
    }

    try {
      const parsedUrl = new URL(url?.includes('https') ? url : `https://${url}`)
      if (searchParams !== undefined) {
        for (const x in searchParams) {
          parsedUrl.searchParams.set(x, searchParams[x])
        }
      }
      const context = this.browser.defaultBrowserContext()
      context.overridePermissions(parsedUrl.origin, ['microphone', 'camera'])
      console.log('navigating to: ' + parsedUrl)
      await this.page.goto(parsedUrl, { waitUntil: 'domcontentloaded' })
    } catch (e) {
      console.log('error in navigation:', e)
    }
  }

  async delay(timeout) {
    console.log(`Waiting for ${timeout} ms... `)
    await this.waitForTimeout(timeout)
  }

  async waitForTimeout(timeout) {
    return await new Promise(resolve => setTimeout(() => resolve(), timeout))
  }

  async waitForSelector(selector, timeout) {
    return this.page.waitForSelector(selector, { timeout })
  }

  counter = 0
  async catchScreenshot() {
    this.counter++
    console.log('screenshot')
    const path = 'screenshot' + this.counter + '.png'
    await this.page.screenshot({ path })
  }

  async typeMessage(input, message, clean) {
    try {
      if (clean)
        await this.page.click(`input[name="${input}"]`, { clickCount: 3 })
      await this.page.type(`input[name=${input}]`, message)
    } catch (e) {}
  }
}
