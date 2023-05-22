---
title: Discord Connector
description: Using Magick agents with Discord
hide_table_of_contents: true
---

# Magick Discord Connector

Magick supports running agents on Discord with both text and voice.

# Usage

Discord can be enabled on any agent. Each agent will need a separate API key.

<!--
User ID - The bot's Discord ID, like bot#1234. This will be removed from messages, although this behavior will change soon.

Bot name - This is how the agent will identify. The agent will generate an event for any message that contains this word, and it will be passed in for the "observer" value of the event.

Wake Words - If a message starts with this the agent will assume interest. "Alexa" and "Hey Google" are examples.
-->

## Creating a New Discord Bot and Getting an API Key

You will need to set up the Discord bot within the Discord Developer portal. A complete tutorial on how to do that is here: https://www.writebots.com/discord-bot-token/

## Inviting the bot to your server

You will need to get your Client ID for the application you just created in the Discord developer portal. A specific tutorial on how to do that is here: https://support.heateor.com/discord-client-id-discord-client-secret/

Once you have the Client ID paste it into the URL below:

```
https://discord.com/api/oauth2/authorize?client_id=<CLIENT ID GOES HERE>&permissions=0&scope=bot%20applications.commands
```

And make sure you delete the < and > - the final result should look like this:

```
https://discord.com/api/oauth2/authorize?client_id=123456789012345678&permissions=0&scope=bot%20applications.commands
```

Now visit that link and invite the bot to the server of your choice.

## Connecting voice

Currently, the bot joins a server when a user writes `join <channel name>`--this will be changed in the v0.2.0 release.

<!--
To enable voice, make sure you enable the switch in the Discord connector and choose a voice.
-->
