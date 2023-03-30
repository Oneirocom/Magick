---
title: Deployment
description: Information about deploying Magick.
hide_table_of_contents: true
sidebar_position: 6
---

# Deployment

## Client

The Magick frontend is set up to deploy to Vercel. To set up a Vercel deployment, create a new Vercel project and link it to the Github repo. Set the "Build Command" field to `npm run build-client` and the "Output Directory" to `dist/apps/client/`. You'll need to use Node.js 18.x and of course you'll need to set up your environment variables to point to a remote server.

## Server

The Magick backend is set up to deploy to Heroku. To set up a Heroku deployment, create a new Heroku app and link it to the Github repo. Set 