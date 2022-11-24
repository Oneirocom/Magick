// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import fs from 'fs'
import puppeteer from 'puppeteer'

//The default browser class for puppeteer, it can be used to build other clients with puppeteer
export async function browserWindow(options: any) {
  if (fs.existsSync('/.dockerenv')) {
    options.headless = true
    options.args = (options.args || []).concat([
      '--no-sandbox',
      '--disable-setuid-sandbox',
    ])
  }

  return await puppeteer.launch(options)
}

export class PageUtils {
  page: any
  autoLog
  constructor({ page = null, autoLog = true }) {
    this.page = page
    this.autoLog = autoLog
  }

  async clickButton(buttonName: any) {
    await this.page.evaluate((selector: any) => {
      const v = document.querySelector(selector)
      if (v != undefined && v != null) v.click()
    }, buttonName)
  }

  //clicks a selector using the class name's regex
  async clickSelectorClassRegex(selector: any, classRegex: any) {
    if (this.autoLog)
      console.log(`Clicking for a ${selector} matching ${classRegex}`)

    await this.page.evaluate(
      (selector: any, _classRegex: any) => {
        const classRegex = new RegExp(_classRegex)
        const buttons = Array.from(document.querySelectorAll(selector))
        const enterButton = buttons.find(button =>
          Array.from(button.classList).some((c: string) => classRegex.test(c))
        )
        if (enterButton) enterButton.click()
      },
      selector,
      classRegex.toString().slice(1, -1)
    )
  }
  //clicks a selector based on their id
  async clickSelectorId(selector: any, id: any) {
    if (this.autoLog) console.log(`Clicking for a ${selector} matching ${id}`)

    await this.page.evaluate(
      (selector: any, id: any) => {
        const matches = Array.from(document.querySelectorAll(selector))
        console.log('matches length:', matches.length)
        const singleMatch = matches.find(button => button.id === id)
        if (singleMatch && singleMatch.click) {
          console.log('normal click, singleMath:', singleMatch)
          singleMatch.click()
        }
        if (singleMatch && !singleMatch.click) {
          console.log('on click')
          singleMatch.dispatchEvent(new MouseEvent('click', { bubbles: true }))
        }
        if (!singleMatch) {
          console.log('event click', matches.length)
          if (matches.length > 0) {
            const m = matches[0]
            m.dispatchEvent(new MouseEvent('click', { bubbles: true }))
          }
        }
      },
      selector,
      id
    )
  }
  //clicks a selector based on their alt value
  async clickSelectorByAlt(selector: any, title: any) {
    if (this.autoLog)
      console.log(`Clicking for a ${selector} matching ${title}`)

    await this.page.evaluate(
      (selector: any, title: any) => {
        const matches = Array.from(document.querySelectorAll(selector))
        const singleMatch = matches.find(btn => btn.alt === title)
        if (singleMatch && singleMatch.click) {
          console.log('normal click')
          singleMatch.click()
        }
        if (singleMatch && !singleMatch.click) {
          console.log('on click')
          singleMatch.dispatchEvent(new MouseEvent('click', { bubbles: true }))
        }
        if (!singleMatch) {
          console.log('event click', matches.length)
          if (matches.length > 0) {
            const m = matches[0]
            m.dispatchEvent(new MouseEvent('click', { bubbles: true }))
          }
        }
      },
      selector,
      title
    )
  }
  //clicks the first selector it finds of the given type
  async clickSelectorFirstMatch(selector: any) {
    if (this.autoLog) console.log(`Clicking for first ${selector}`)

    await this.page.evaluate((selector: any) => {
      const matches = Array.from(document.querySelectorAll(selector))
      const singleMatch = matches[0]
      if (singleMatch) singleMatch.click()
    }, selector)
  }
}
