---
title: Libraries and Frameworks
description: Information about the libraries and frameworks used in Magick.
hide_table_of_contents: true
sidebar_position: 2
---

# Libraries and Frameworks

Magick uses a lot of different packages, but there are some common ones that are used everywhere which you should be familiar with.

## Core Frameworkxs
### Nx
Monorepo build system - https://nx.dev/
Nx manages builds, packaging and more. We use Nx generators to create new packages. It's important to learn a bit about Nx, especially if you are running into issues and need to reset your cache or you want to add a new plugin.

### Rete.js
Node framework and visual node editor system - https://rete.js.org/
The rete algorithm is a rule-based algorithm for determining how data flows through a graph. Rete.js is a visual node system based on this algorithm. Magick is powered by Rete and uses many heavily modified modified Rete plugins.

## Server Frameworks
### Koa
HTTP framework for the server. Similar to express. https://koajs.com/
Koa is mainly used by Feathers, but we can also add custom server routes by hooking into the Koa app object.

### Feathers
Full-stack web framework for creating APIs and real-time applications. https://feathersjs.com/
Feathers is a powerful web framework that uses Koa (or Express) under the hood. Follows a "service" pattern, where services can be generated from the Feathers CLI and include full CRUD and connections to the database. Also supports realtime socket streaming. All of our backend and client data streaming runs through Feathers.

### Knex
Query builder for SQL. Used by Feathers for communicating with the database. https://knexjs.org/
Knex is similar to ORMs like Prisma, but is lower level and focuses on queries. Knex is mainly used directly by Feathers for connecting to the database, but we also use Knex for managing migrations and making occasional raw SQL calls.

## Client
### React
Most popular frontend framework. https://react.dev/
The entire client is built in modern React.

### Redux
Centralized state management framework. https://redux.js.org/
Magick uses Redux under the hood for application state. However, most of the direct Redux boilerplate and functionality is abstracted via Redux Toolkit.

### Redux Toolkit
Complete toolset for efficient Redux development. https://redux-toolkit.js.org/
RTK drastically reduces the pain of working with Redux. We use this especially for all queries and asynchronous state. RTK especially helps with syncing state and asynchronous calls.

### Material UI
UI toolkit based on the Material design system. https://material-ui.com/
We use MUI heavily for all UI elements in Magick.

### Vite
Frontend tooling and development environment. https://vitejs.dev/
All of our client apps and packages are bundled with Vite.

## Database

### Postgres
Full SQL database. https://www.postgresql.org/
Postgres is a full SQL database that can be used for storing user data and project data. In production we use Postgres with Supabase.

### PGVector
Similarity search for Postgres. https://github.com/pgvector/pgvector
In production we use pgvector for similarity search on events and documents.

## Native Application

### Capacitor
Cross-platform native runtime. https://capacitorjs.com/
Capacitor is a cross-platform native runtime that allows us to run the same code on iOS, Android and Electron. We use Capacitor to create the native Electron app, as well as to create the native Android and iOS apps. Capacitor also allows us to use native plugins.

### Capacitor Community Electron
Electron plugin for Capacitor. https://github.com/capacitor-community/electron
Electron powers many apps built using web-technologies. Capacitor bridges electron to our web-native project, so we don't need to write any custom code for native apps.