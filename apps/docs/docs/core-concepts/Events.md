---
title: Events
description: Information about events.
hide_table_of_contents: true
sidebar_position: 5
---

# Events

In Magick, events are things that happen and contain interesting information. Some writing pings our bot on Discord or someone posts a tweet with a hashtag we're following. We want our agent to respond to that event, but we need some information about it. Where did the event come from? From who? On what server/feed/channel?

Events are large blocks of data that contain all of this metadata. If someone writes "Hello Bot" on Discord, there will be a "content" field added to the event with the value "Hello Bot".

In practice, this looks like adding a row to a spreadsheet. The columns are all stuff that you might need to do stuff with later.

By default, events are not stored in the database. They come in, are handled, and then forgotten. If you want to remember events--for example, in a conversation, you'll need to use the "Store Event" node and, likewise, if you want to get the event back you'll need to use the "Events Recall" node.

Spells can run anywhere, anytime, and can be used by many agents at once. It doesn't make sense for them to keep all of the events inside the spell. In engineering terms, spells are "stateless".

By storing events we can give our agents memory or create long-running tasks, games, counters or other necessary components for a Magick project.

## Using With Embeddings

Events can be processed and stored with embeddings so they can be searched later. Unlike a traditional search using keywords, searching over embeddings can be fuzzy and conceptual. "Actors from the 1940s" will bring up people from movies in the 1940s, even if those words never exactly appear in any of the text.

This is an extremely powerful tool that can be utilized for long term memory and searching through prior events based on conceptual similarity.

To use embeddings, you'll need a "Create Text Embedding" node. Pass the output into the "Store Event" node to store it with the event. To recall embeddings, you can use the "Find Text Embedding" node and/or "Create Text Embedding" on the incoming content, then pass the output to the "Event Recall" node.
