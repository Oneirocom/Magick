---
title: Package Overview
description: Information about the packages in Magick.
hide_table_of_contents: true
sidebar_position: 1
---

# Package Overview

## Apps

### Client

@magickml/client (./apps/client)
Frontend application. Everything the user sees in Magick IDE is exposed through the client, although most of the code lives in client-core and editor packages, as well as engine. Thin, mostly contains build settings and entrypoint.

### Server

@magickml/server (./apps/server)
Backend server application. Depends on server-core and engine. Thin, mostly contains startup code and configuration for the server. Provides an API which the client talks to, and runs preview spells for clients.

### Agent

@magickml/agent (./apps/agent)
Backend agent application. Depends on server-core and engine. Thin, startups the AgentManager and manages agents from the database. Talks directly to the database, not to the server.

### Docs

@magickml/docs (./apps/docs)
Documentation server build on Docusaurus.

## Shared Packages

### Engine

shared/core (./packages/core/shared)
Core runtime code for Magick. Contains all of the spell and spell running code, common interfaces and nodes. Available for install via [npm](https://www.npmjs.com/package/shared/core)

## Front End Packages

### Client Core

@magickml/client-core (./packages/core/client)
Frontend UI components and common code.

### Editor

@magickml/editor
Application code for the IDE, including windows, providers and state. Used in the client. Exports the entire Magick editor as components which can be imported whole or individually for custom routing (for example, in a Next.js frontend). Available for install via [npm](https://www.npmjs.com/package/@magickml/editor)

## Server Packages

### Server Core

@magickml/server-core (./packages/core/server)
Contains all of the server code, imported by the server and agent apps.
