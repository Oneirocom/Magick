---
title: Nodes
description: This is where you will find information relevant to nodes in Magick.
hide_table_of_contents: true
sidebar_position: 3
---

# Nodes

At the core, Magick is a system for taking in data, doing stuff to it, then doing more stuff to it and then sending the final data out.

This "stuff" is called a "transformation". The data transforms from one thing into the next.

The "stuff" that is happening to the data is a black box that takes something in, anything, and returns something out. Data has different types, with a different color for each data shape. Red goes with red, blue goes with blue. Some data is simple: a string (short for string of characters, like "blaskdjasl" or "123456"), a number (like 0, 7843.05). Some data is complex, like an array (a collection of simple data like [1, 2, 3, 4]).

## Socket Inputs and Outputs

All nodes have some inputs and/or outputs, although they don't necessarily have to have both.

Inputs and outputs are visually displayed as sockets. The color of the socket determines the type of data it can receive, with "gray" being the default untyped or "any" type.

Data passed into sockets is available to the node. The node can process that data, do something to do, and then send it to the outputs. Some nodes (like Generator node) let you define your own input sockets and then work with that data inside of the node. Some nodes (like the Code node) let you define both inputs and outputs.

## Triggers

Triggers tell nodes to start asynchronous tasks. Some nodes can provide data without needing a trigger, but most nodes need triggers. Triggers can be emitted from one socket out to more then one input, however the order of execution is not guaranteed. You can use the "Wait For All" node to wait for different execution branches to complete before joining back into a single branch -- this is a good way to do several slow tasks at once.

## Creating Nodes

Nodes are created in the composer window of the "Spells" tab. You can right-click in the composer and add nodes from the context menu.

[If you want to become a Magick contributor, add an image here!]
