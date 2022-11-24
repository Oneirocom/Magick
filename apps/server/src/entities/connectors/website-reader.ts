// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import * as fs from 'fs'

import Browser from '../browser-launcher'
import { detectOsOption } from './utils'
import { createWebsiteReader } from './website-reader'

/*
    Website Reader is used a standalone app in order to read the pages of a book
    and return it as a txt from booksvooks.com which can be used for the agents to learn
*/

//npm run read_book --url https://booksvooks.com/scrolablehtml/pale-blue-dot-a-vision-of-the-human-future-in-space-pdf.html?page=1 --pages 210 --fileName test
const params = process.argv.slice(2)
createWebsiteReader(params[0], parseInt(params[1]), params[2])

let browser
let page

export const createWebsiteReader = async (bookUrl, maxPage, fileName) => {
    const options = {
        headless: true,
        ignoreHTTPSErrors: true,
        args: [
            '--disable-web-security=1',
            '--autoplay-policy=no-user-gesture-required',
        ],
        ignoreDefaultArgs: ['--mute-audio', '--mute-video'],
        ...detectOsOption(),
    }

    browser = await Browser.window(options)
    page = await browser.newPage()
    page.setViewport({ width: 0, height: 0 })
    await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36'
    )
    await navigate(bookUrl)
    await delay(5000)

    let _text = ''
    for (let i = 1; i < maxPage; i++) {
        const text = await page.evaluate(() => {
            const el = document.getElementById('demo')
            return el.innerHTML
        })

        const data = getText(text)
        _text += data + '\n'
        navigate(bookUrl.substring(0, bookUrl.length - 1) + (i + 1))
        await delay(5000)
    }
    fs.writeFileSync(fileName + '.txt', _text)
}

const getText = text => {
    const lines = text.split('\n')
    let _res = ''
    for (let i = 0; i < lines.length; i++) {
        if (
            !lines[i].toLowerCase().includes('<p>') &&
            !lines[i].toLowerCase().includes('</p>')
        ) {
            //
        } else {
            _res = lines[i].split('<p></p>').join('\n---\n')
            _res = _res.split('\n---\n\n---\n').join('')
            _res = _res.split('<p>').join('')
            _res = _res.split('</p>').join('\n')
            _res = _res.replace(/<\/?[^>]+(>|$)/g, '')
        }
    }
    return _res.trim()
}

const navigate = async (url, searchParams) => {
    const parsedUrl = new URL(url.includes('https') ? url : `https://${url}`)
    if (searchParams !== undefined) {
        for (const x in searchParams) {
            parsedUrl.searchParams.set(x, searchParams[x])
        }
    }
    const context = browser.defaultBrowserContext()
    context.overridePermissions(parsedUrl.origin, ['microphone', 'camera'])
    console.log('navigating to: ' + parsedUrl)
    await page.goto(parsedUrl, { waitUntil: 'domcontentloaded' })
}

let counter = 0
const catchScreenshot = async () => {
    counter++
    console.log('screenshot')
    const path = 'screenshot' + counter + '.png'
    await page.screenshot({ path })
}

const delay = async timeout => {
    console.log(`Waiting for ${timeout} ms... `)
    await waitForTimeout(timeout)
}

const waitForTimeout = async timeout => {
    return await new Promise(resolve => setTimeout(() => resolve(), timeout))
}
