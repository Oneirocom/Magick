---
title: Using API Key
description: This is where you will find information on how to use your API key.
hide_table_of_contents: false
sidebar_position: 3
---

### You need an API key to call your thoth spell endpoints. You can test your spell using a tool like [Postman](https://www.postman.com/) or use it by sending a [POST](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/POST) request from your code. Once you have generated your API key your going to have something that looks like this:

---

eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjMyMTc4Mzg5IiwiZW1haWwiOiJqYWtvYkBsYXRpdHVkZS5pbyIsIm5hbWUiOiJoYXJ1aHVuYWIxMzIwIiwiYXBpS2V5Ijp7ImNyZWF0ZWRBdCI6IjIwMjItMDQtMTZUMTg6Mzc6NDAuMTk0WiIsInVwZGF0ZWRBdCI6IjIwMjItMDQtMTZUMTg6Mzc6NDAuMTk0WiIsImtleSI6IjY0MThmY2EzLTQ4N2ItNGQ4ZS1hYTYxLWExYjQ3MjVjMmQ2ZCIsImlkIjoiNzQiLCJ1c2VySWQiOiIzMjE3ODM4OSIsImRlbGV0ZWRBdCI6bnVsbCwibm90ZXMiOm51bGx9LCJpYXQiOjE2NTAxMzQyNjB9.36bkZ4PZW35znCojKsUTxaIiNqJXtiEX2GkC514wFD0

---

## Using your API key to call your spell

Once you have your [spells generated endpoint](/docs/creators/gettingStarted/DeployASpell) your will have something that looks like this:

For your live spell in development you will have something like this with **/latest** at the end:
`https://api.latitude.io/game/chains/MyAwesomeNewGame/latest`

For a deployed spell you will have something like this with a version number at the end like **/0.0.1**:
`https://api.latitude.io/game/chains/MyAwesomeNewGame/0.0.1`

You can [test your spell with a tool like Postman](/docs/creators/apikey/TestingWithPostman) or use it in your app by [sending a POST request](/docs/creators/apikey/PostRequest).
