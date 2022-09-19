---
title: Structure of an Agent
description: What is an Agent and how is it structured
hide_table_of_contents: false
sidebar_position: 1
---

# Agent Architecture of an Agent

## Data Structure

speaker -- key of who is speaking, probably discord id of person chatting with agent
agent -- key of this particular agent receiving, since each agent can be different, probably supplied from agent settings (depends on connector)
client -- type of client -- discord, xrengine, etc
channel -- where it is received, i.e. discord channel or xrengine room (at least ideally, discord does this but other connectors might need work)
entity -- information about this running entity instance (entity number, etc)
roomInfo -- info from the world, this is how we do text gen from worlds ideally
output -- actual information received

### Input

This is the input which the agent is receiving. Usually a snippet of conversation, but could be anything that is being processed by the particular agent.

### Speaker

The person interacting with or engaging with the Agent. This helps to store associated data between the speaker and the agent. Could be a user ID, a user name, etc.

### Agent

Key of this particular agent receiving the input, since each agent can be different, probably supplied from agent settings (depends on connector). Agent is and ID.

### Client

Type of client that is interacting with the Agent (discord, XR Engine, twitter, web, etc)

### Channel Id

Where it is received from, i.e. discord channel or xrengine room (at least ideally, discord does this but other connectors might need work)

### Entity

Information about this running entity instance (entity number, etc)

### roomInfo

Info from the world, this is how we do text gen from worlds ideally

### Output (output socket)

This is the original input that was received.
