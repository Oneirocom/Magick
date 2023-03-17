---
title: Plugin Development
description: This is where you will find information relevant to the plugin system.
hide_table_of_contents: true
sidebar_position: 4
---

# Plugin Development

Magick provides entrypoints for plugins in both the server and client to radically expand capability without requiring significant changes to the core. Most connectors and external services are integrated with Magick via a plugin system. 

## Creating Your Own Plugin

Plugins are packages which contain instances of the ServerPlugin or ClientPlugin class. These plugins are referenced in the .env and are linked after `npm install` is run.

You can create a plugin from scratch by generating a new package using Nx and setting up the library to create the plugin class instance. However, the easier way to do this is to look at the list of existing plugins, duplicate the one that is the most similar and rename it. In the future we'll have an Nx plugin generator, but for now copy and pasting is how we do it.

### Linking Your Plugin

If you're creating a new plugin within the monorepo, you'll need to make sure that your plugin is added as a package to the tsconfig.base.json file in the root of the Magick repo. If the package is developed externally, you'll need to npm install it. You'll also need to make sure that it's added to your .env or .env.local

On install, plugins are loaded from the .env and generates a plugins.ts into the client and server. To customize which plugins are loaded, copy the `CLIENT_PLUGINS` and `SERVER_PLUGINS` variables from the .env to your .env.local and adjust the plugins as needed.