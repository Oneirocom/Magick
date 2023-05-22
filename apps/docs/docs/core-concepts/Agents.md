---
title: Agents
description: Information about agents.
hide_table_of_contents: true
sidebar_position: 5
---

# Agents

In Magick, running applications are known as "agents". This is borrowed from the machine learning world. Sometimes agents are called actors.

What makes an agent an agent is really about how it sees the world and interacts with users. An agent has agency. Users can ask it to do stuff, or it can do stuff on its own.

The main takeaway here is that the agent is a live running process happening on a server somewhere. If you turn it on, it wakes up somewhere in the world and starts doing whatever you told it to do.

## Deploying an Agent

(Deploying means "putting it out in the world to do stuff". )

When you are ready to connect your spell to Discord or another service, you'll need to first create an agent. You can create many agents per project.

## Public Variables

If you set variables in your spells to "isPublic", you'll be able to edit their value in the agent window. This way you can create many agents who can interact with each other but can have very different parameters. If you were to, say, set up an alternate reality game with many AI characters, you may want to expose their name, bio, likes and dislikes etc as public variables.

## Connectors

For an agent to interact with the world, they need to be connected to it. Magick comes with some default connectors, including Discord and Twitter. The community has also added some connectors, like Ethereum.

Connectors are enabled in the "agents" window.

For more information, please see the "Connectors" section
