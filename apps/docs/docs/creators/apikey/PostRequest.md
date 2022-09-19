---
title: API key from within code
description: This is where you will find information on how to use your API key with a POST request.
hide_table_of_contents: false
sidebar_position: 5
---

Depending on the language your site is written in you may fetch your data utilizing a variety of REST request tools. Here we will demonstrate how to call your spell utilizing the [javascript Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)

## Sending a POST request using the Fetch API

You probably want to hard code your API key into an .env file but for a clear demonstration we are including it here.

```
 const myApiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjMyMTc4Mzg5IiwiZW1haWfdsfdswiOiJqYWtvYkBsYXRpdHVkZS5pbyIsIm5hbWUiOiJoYXJ1aHVuYWIxMzIwIiwiYXBpS2V5Ijp7ImNyZWF0ZWRBdCI6IjIwMjItMDQtMTZUMTg6Mzc6NDAuMTk0WiIsInVwZGF0ZWRBdCI6IjIwMjItMDQtMTZUMTg6Mzc6NDAuMTk0WiIsImtleSI6IjY0MThmY2EzLTQ4N2ItNGQ4ZS1hYTYxLWExYjQ3MjVjMmQ2ZCIsImlkIjoiNzQiLCJ1c2VySWQiOiIzMjE3ODM4OSIsImRlbGV0ZWRBdCI6bnVsbCwibm90ZXMiOm51bGx9LCJpYXQiOjE2NTAxMzQyNjB9.36bkZ4PZW35znCojKsUTxaIiNqJXtiEX2GkC514wFD0f'

 const mySpell = 'https://api.latitude.io/game/chains/MyAwesomeNewGame'

  const spellEndpoint = `https://api.latiutude.io/game/chains/${encodeURIComponent(
    mySpell
  )}/latest`;

  const body = {
    "myFirstInputsName": "Some random value for demonstration"
  }
  const spellRequest = await fetch(spellEndpoint, {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
      Authorization: myApiKey,
    },
  });

  const spellResponse = await spellRequest.json();

  return spellResponse;
```

The spellResponse in this case will contain the expected outcome from calling your spell or will contain error information if your body data is incorrect or some other error has occured.
