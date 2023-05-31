---
title: Setup and Installation
description: This is where you will learn how to connect your first component.
hide_table_of_contents: true
sidebar_position: 2
---

# Getting Started

## Setup and Installation

There are three ways to use Magick: on the cloud, as a standalone app or by running the code from source.

## Cloud

You can use Magick through the hosted web app at https://cloud.magickml.com/

For the alpha phase, joining is free. However, you will need your OpenAI API keys.

## Standalone App (.exe, .app, etc)

The standalone app is available at https://github.com/Oneirocom/Magick/releases

## Source

You can also build from source. Refer to the Magick [README](https://github.com/Oneirocom/Magick/blob/development/README.md) for the latest steps on installing and how to clone the repo and run from source.

Development is straightforward. You will need git and node.js 18+ installed.

```
git clone https://github.com/Oneirocom/Magick
cd Magick
npm install
npm run dev
```

Installation is automatic. You may need to type in your password for sudo to install some dependencies.

Build will take some time initially. When everything is ready, the client will be ready at localhost:4200 and docs at localhost:3001
