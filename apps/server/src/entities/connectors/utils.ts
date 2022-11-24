/* eslint-disable no-console */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck

import { existsSync } from 'fs'

export function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function getRandomEmptyResponse(responses: string[] = undefined) {
  if (!responses || responses === undefined || responses.length <= 0)
    return "I can't understand!"

  return responses[getRandomNumber(0, responses.length - 1)]
}

export function startsWithCapital(word) {
  return word.charAt(0) === word.charAt(0).toUpperCase()
}

export function getOS() {
  const platform = process.platform
  let os
  if (platform.includes('darwin')) {
    os = 'Mac OS'
  } else if (platform.includes('win32')) {
    os = 'Windows'
  } else if (platform.includes('linux')) {
    os = 'Linux'
  }

  return os
}

//returns the Chrome path for puppeteer based on the OS
export function detectOsOption() {
  const os = getOS()
  const options = { executablePath: null }
  let chromePath = ''
  switch (os) {
    case 'Mac OS':
      chromePath =
        '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
      break
    case 'Windows':
      chromePath = 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe'
      break
    case 'Linux':
      chromePath = '/usr/bin/google-chrome'
      break
    default:
      break
  }

  if (chromePath) {
    if (existsSync(chromePath)) {
      options.executablePath = chromePath
    } else {
      console.log(
        'Warning! Please install Google Chrome to make bot workiing correctly in headless mode.\n'
      )
    }
  }
  return options
}

export function convertLocalToUtcTimezone(date) {
  return new Date(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds()
  )
}

export function wait(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}

export function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
export function randomFloat(min, max) {
  return Math.random() * (max - min + 1) + min
}

export class idGenerator {
  id = 0

  getId() {
    return this.id++
  }

  reset() {
    this.id = 0
  }
}

export function getSetting(settings: any[], key: string) {
  for (let i = 0; i < settings.length; i++) {
    if (settings[i].name === key) {
      return settings[i].value
    }
  }

  return undefined
}

export const makeGreeting = (
  greeting: string, { 
    userName, 
    serverName 
  } : { 
    userName: string, 
    serverName: string
  }
) => {
  if(!greeting) return ''
  if(greeting.includes('$user')) greeting = greeting.replaceAll('$user', userName)
  if(greeting.includes('$server')) greeting = greeting.replaceAll('$server', serverName) 
  return greeting
}