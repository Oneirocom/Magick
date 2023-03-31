---
title: Spells
description: This is where you will find information relevant to Few Shots.
hide_table_of_contents: true
sidebar_position: 5
---

# Spells

In Magick, the collection of data, nodes, variable presets, etc. for each graph is known as a "spell". Sometimes we say graph, sometimes we say spell. Technically the graph is inside the spell.

Spell is not a machine learning term. We just like it.

A spell is a pipeline that describes data moving from one place to another. The data moves through different processes we call "nodes", via wires we call "connections".

## Input

Data comes in through various inputs. Some of these inputs are default, some are defined by plugins, which can register their own inputs and handlers.

You can have multiple inputs but only one will fire per spell run.

# Output

Outputs can similarly be defined by plugins. Unlike inputs, you can have multiple outputs.

The "Default" output will respond to the original input event using the same settings. You can also handle the event and send it elsewhere if you want to build multi-modal agents who have access to many services.

Outputs will fire immediately, even before the graph is returned, so you can chain slower tasks onto your spell after the output (storing memory, processing data, etc).

## Events

The data coming into the input can be anything, but usually it's expressed as some kind of event. Message received on discord? Event. Someone posted with a hashtag our agent listens for on Twitter? Event.

These events arrive at the input. There's a whole bunch of data packed into that event, so usually we need to destructure it. If someone writes "Hello World" on Discord and we want to get that text, we need to add an "Event Destructure" node to break the data out and get the content.

Events are complicated because they include a lot of data, and are covered in a separate section.

## Importing and Exporting

Spells can be imported and exported at any time. Spells in their raw form are JSON, which is a standard format that developers like. Spells can be quickly shared this way.

## Root Spell

Spells are roughly broken up into "root spells" and "subspells". There is no difference between them, but root spells are started by agents and usually have several inputs and pathways for data to flow.

When creating an agent, you will need to select a root spell. Each agent must have one and only one. However, a root spell can have any number of nested subspells.

## Subspells

One of the most powerful features of Magick is that spells can be placed within other spells. This allows you to build and test isolated skills and then extend them to incredible complexity.

You can add a subspell by dropping a spell node into your graph. Each subspell can have one input, but you can add more inputs by exposing variables to the parent spell by enabling their "isPublic" setting.

## Loop Connector

The Loop connector also allows the agent to wake up and run a spell.
