// DOCUMENTED
/**
 * Client module for the Ethereum plugin.
 *
 * Custom client component made to extend the functionality of the Ethereum plugin. It allows adding new features
 * to editor.
 *
 * @packageDocumentation
 */

import { ClientPlugin, SpellInterface } from '@magickml/core';
import { EthereumAgentWindow } from './components/agent.component';
import { getNodes } from '@magickml/plugin-ethereum-shared';

import _EthereumDemoSpellTemplate from './templates/spells/EthereumDemo.spell.json'

// TODO: add schema validation with e.g. zod
// Typecast `EthereumSpellTemplate` to `SpellInterface`
const EthereumDemoSpellTemplate = _EthereumDemoSpellTemplate as unknown as SpellInterface

/**
 * An Ethereum instance of the ClientPlugin class with agent window and client secrets.
 * @constant
 * @public
 * @type {ClientPlugin}
 */
const EthereumPlugin = new ClientPlugin({
  name: 'EthereumPlugin',
  nodes: getNodes(),
  agentComponents: [EthereumAgentWindow],
  spellTemplates: [EthereumDemoSpellTemplate],
  drawerItems: [],
  clientRoutes: [],
  secrets: [
    {
      name: 'Ethereum Private Key',
      key: 'ethereum_private_key',
      global: true,
    }
  ]
})

export default EthereumPlugin;
