---
title: Event Overview
description: How events work
hide_table_of_contents: false
sidebar_position: 1
---

# Events

Events are an important mechanism for state in Magick. An event is generic and can be anything. Certain nodes can wrap the event interface to build specific events (for example, Conversation Store and Recall).

Events are useful for short term memory, but can also be generalized to any state that needs to be stored and recalled later, or generally for logging.

## Data Structure

type Event = {
  id: number // unique id of each event, ascending
  type: string // key, user defined, can be anything
  sender: string // who sent the event
  observer: string // who observed it, usually the agent
  entities: string[] // who or what was nearby
  content: string // the actual message, data or general content of the event
  client: string // what platform did the data arrive on?
  channel: string // what channel? this would be a server or a context
  channelType: string // what type of channel? this would indicate, say, a DM vs a public guild 
  date: string
}