// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import fs from 'fs'
import { calendar_v3, google } from 'googleapis'
import path from 'path'

import { sendMessageToChannel } from './discord'

const rootDir = path.resolve(path.dirname(''))
//to generate a google token you can use https://developers.google.com/oauthplayground/
const TOKEN_PATH = rootDir + '/credentials/token.json'
let calendar: calendar_v3.Calendar

export function initCalendar() {
  if (!fs.existsSync(rootDir + '/credentials')) {
    fs.mkdirSync(rootDir + '/credentials', { recursive: true })
  }

  fs.readFile(rootDir + '/credentials/google.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err)
    authorize(JSON.parse(content))
  })
}

function authorize(credentials: {
  installed: { client_secret: any; client_id: any; redirect_uris: any }
}) {
  const { client_secret, client_id, redirect_uris } = credentials.installed
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  )

  fs.readFile(TOKEN_PATH, (err, token: any) => {
    oAuth2Client.setCredentials(JSON.parse(token))
    calendar = google.calendar({ version: 'v3', auth: oAuth2Client })
    setInterval(() => {
      listEvents()
    }, 3600 * 1000)
  })
}

function listEvents() {
  calendar.events.list(
    {
      calendarId: 'primary',
      timeMin: new Date().toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime',
    },
    async (err, res) => {
      if (err) return console.error('The API returned an error: ' + err)
      const events = res.data.items
      if (events.length) {
        events.map((event, i) => {
          const eventDate = new Date(event.start.dateTime || event.start.date)
          const now = new Date()
          if (eventDate > now) {
            const diffMs = eventDate - now
            const diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000)
            if (diffMins <= 60 && diffMins > 0) {
              // sendMessageToChannel(
              //   (await database.instance.getConfig())[
              //   'discord_calendar_channel'
              //   ],
              //   event.summary + ' is starting in ' + diffMins + ' minutes!'
              // )
            }
          }
        })
      }
    }
  )
}
