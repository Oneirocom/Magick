/* eslint-disable no-param-reassign */
/* eslint-disable require-await */
/* eslint-disable no-empty */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable camelcase */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { launch } from 'puppeteer-stream'
import Xvfb from 'xvfb'

import { FILE_SERVER_URL } from './config'
import { detectOsOption } from '../../server/src/entities/connectors/utils'
import { tts } from '../../server/src/googleTextToSpeech'
import { tts_tiktalknet } from '../../server/src/tiktalknet'
function removeEmojisFromString(str: string): string {
  if (!str) return ''

  return str
    .replace(
      /(?:[\u261D\u26F9\u270A-\u270D]|\uD83C[\uDF85\uDFC2-\uDFC4\uDFC7\uDFCA-\uDFCC]|\uD83D[\uDC42\uDC43\uDC46-\uDC50\uDC66-\uDC69\uDC6E\uDC70-\uDC78\uDC7C\uDC81-\uDC83\uDC85-\uDC87\uDCAA\uDD74\uDD75\uDD7A\uDD90\uDD95\uDD96\uDE45-\uDE47\uDE4B-\uDE4F\uDEA3\uDEB4-\uDEB6\uDEC0\uDECC]|\uD83E[\uDD18-\uDD1C\uDD1E\uDD1F\uDD26\uDD30-\uDD39\uDD3D\uDD3E\uDDD1-\uDDDD])(?:\uD83C[\uDFFB-\uDFFF])?|(?:[\u231A\u231B\u23E9-\u23EC\u23F0\u23F3\u25FD\u25FE\u2614\u2615\u2648-\u2653\u267F\u2693\u26A1\u26AA\u26AB\u26BD\u26BE\u26C4\u26C5\u26CE\u26D4\u26EA\u26F2\u26F3\u26F5\u26FA\u26FD\u2705\u270A\u270B\u2728\u274C\u274E\u2753-\u2755\u2757\u2795-\u2797\u27B0\u27BF\u2B1B\u2B1C\u2B50\u2B55]|\uD83C[\uDC04\uDCCF\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE1A\uDE2F\uDE32-\uDE36\uDE38-\uDE3A\uDE50\uDE51\uDF00-\uDF20\uDF2D-\uDF35\uDF37-\uDF7C\uDF7E-\uDF93\uDFA0-\uDFCA\uDFCF-\uDFD3\uDFE0-\uDFF0\uDFF4\uDFF8-\uDFFF]|\uD83D[\uDC00-\uDC3E\uDC40\uDC42-\uDCFC\uDCFF-\uDD3D\uDD4B-\uDD4E\uDD50-\uDD67\uDD7A\uDD95\uDD96\uDDA4\uDDFB-\uDE4F\uDE80-\uDEC5\uDECC\uDED0-\uDED2\uDEEB\uDEEC\uDEF4-\uDEF8]|\uD83E[\uDD10-\uDD3A\uDD3C-\uDD3E\uDD40-\uDD45\uDD47-\uDD4C\uDD50-\uDD6B\uDD80-\uDD97\uDDC0\uDDD0-\uDDE6])|(?:[#\*0-9\xA9\xAE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9\u21AA\u231A\u231B\u2328\u23CF\u23E9-\u23F3\u23F8-\u23FA\u24C2\u25AA\u25AB\u25B6\u25C0\u25FB-\u25FE\u2600-\u2604\u260E\u2611\u2614\u2615\u2618\u261D\u2620\u2622\u2623\u2626\u262A\u262E\u262F\u2638-\u263A\u2640\u2642\u2648-\u2653\u2660\u2663\u2665\u2666\u2668\u267B\u267F\u2692-\u2697\u2699\u269B\u269C\u26A0\u26A1\u26AA\u26AB\u26B0\u26B1\u26BD\u26BE\u26C4\u26C5\u26C8\u26CE\u26CF\u26D1\u26D3\u26D4\u26E9\u26EA\u26F0-\u26F5\u26F7-\u26FA\u26FD\u2702\u2705\u2708-\u270D\u270F\u2712\u2714\u2716\u271D\u2721\u2728\u2733\u2734\u2744\u2747\u274C\u274E\u2753-\u2755\u2757\u2763\u2764\u2795-\u2797\u27A1\u27B0\u27BF\u2934\u2935\u2B05-\u2B07\u2B1B\u2B1C\u2B50\u2B55\u3030\u303D\u3297\u3299]|\uD83C[\uDC04\uDCCF\uDD70\uDD71\uDD7E\uDD7F\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE02\uDE1A\uDE2F\uDE32-\uDE3A\uDE50\uDE51\uDF00-\uDF21\uDF24-\uDF93\uDF96\uDF97\uDF99-\uDF9B\uDF9E-\uDFF0\uDFF3-\uDFF5\uDFF7-\uDFFF]|\uD83D[\uDC00-\uDCFD\uDCFF-\uDD3D\uDD49-\uDD4E\uDD50-\uDD67\uDD6F\uDD70\uDD73-\uDD7A\uDD87\uDD8A-\uDD8D\uDD90\uDD95\uDD96\uDDA4\uDDA5\uDDA8\uDDB1\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA-\uDE4F\uDE80-\uDEC5\uDECB-\uDED2\uDEE0-\uDEE5\uDEE9\uDEEB\uDEEC\uDEF0\uDEF3-\uDEF8]|\uD83E[\uDD10-\uDD3A\uDD3C-\uDD3E\uDD40-\uDD45\uDD47-\uDD4C\uDD50-\uDD6B\uDD80-\uDD97\uDDC0\uDDD0-\uDDE6])\uFE0F/g,
      ''
    )
    .replace(/:(.*?):/g, '')
}
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
              (FILE_SERVER_URL?.endsWith('/')
                ? FILE_SERVER_URL
                : FILE_SERVER_URL + '/') + fileId
            response = url
          } else {
            const fileId = await tts_tiktalknet(
              response,
              this.settings.voice_character,
              this.settings.tiktalknet_url
            )
            const url =
              (FILE_SERVER_URL?.endsWith('/')
                ? FILE_SERVER_URL
                : FILE_SERVER_URL + '/') + fileId
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
