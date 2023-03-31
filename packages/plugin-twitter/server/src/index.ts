// GENERATED 
import { eventSocket, ServerPlugin, triggerSocket, WorldManager } from '@magickml/engine';

// Declare variable for TwitterConnector with an initial value of 'null'
let TwitterConnector = null as any;

// Perform dynamic import of TwitterConnector if in a Node.js environment using ESM syntax
if (typeof window === 'undefined') {
  import('./connectors/twitter').then((module) => {
    TwitterConnector = module.TwitterConnector;
  });
}

/**
 * Type definition for the arguments required to start Twitter
 */
type StartTwitterArgs = {
  agent: any;
  spellRunner: any;
  worldManager: WorldManager;
};

/**
 * Return an object with methods for starting and stopping Twitter
 */
function getAgentMethods() {
  /**
   * Start Twitter for the agent, if enabled and configured with an API key
   * @param {StartTwitterArgs} - An object containing the agent, spellRunner, and worldManager
   */
  async function startTwitter({ agent, spellRunner, worldManager }: StartTwitterArgs) {
    const { data } = agent.data;
    if (!data) return console.log('No data for this agent');
    if (!data.twitter_enabled) return console.log('Twitter is not enabled for this agent');
    if (!data.twitter_api_key) return console.log('Twitter API key is not set for this agent');
    console.log('starting twitter connect');
    const twitter = new TwitterConnector({
      agent,
      spellRunner,
      worldManager,
    });
    agent.twitter = twitter;
  }

  /**
   * Stop Twitter for the agent, if running
   * @param {Object} - An object containing the agent
   */
  async function stopTwitter({ agent }: { agent: any }) {
    if (!agent.twitter) return console.warn("Twitter isn't running, can't stop it");
    try {
      await agent.twitter.destroy();
      agent.twitter = null;
    } catch {
      console.log('Agent does not exist !');
    }
    console.log('Stopped twitter client for agent ' + agent.name);
  }

  return {
    start: startTwitter,
    stop: stopTwitter,
  };
}

/**
 * Handle the response to Twitter messages based on the output value
 * @param {Object} - An object containing the output, agent, and event data
 */
async function handleResponse({ output, agent, event }: { output: string; agent: any; event: any }) {
  console.log('********* SENT MESSAGE TO TWITTER', agent.id, output, event);
  console.log('event is', event);
  console.log('event.channel is', event.channel);
  return;

  if (output && output.length > 0) {
    if (output === 'like' || output === 'heart') {
      await agent.twitter.twitterv2.v2.like(agent.twitter.localUser.data.id, event.channel);
    } else if (output !== 'ignore') {
      await agent.twitter.handleMessage(output, event.channel, 'feed');
    } else if (output === 'retweet') {
      await agent.twitter.twitterv2.v2.retweet(agent.twitter.localUser.data.id, event.channel);
    }
  }
}

// Define input sockets for the TwitterPlugin
const inputSockets = [
  {
    socket: 'output',
    name: 'output',
    type: eventSocket,
  },
  {
    socket: 'trigger',
    name: 'trigger',
    type: triggerSocket,
  },
];

// Define output sockets for the TwitterPlugin
const outputSockets = [
  {
    socket: 'output',
    name: 'output',
    type: eventSocket,
  },
];

// Define the TwitterPlugin with appropriate configurations
const TwitterPlugin = new ServerPlugin({
  name: 'TwitterPlugin',
  inputTypes: [
    {
      name: 'Twitter (Feed)',
      sockets: inputSockets,
      defaultResponseOutput: 'Twitter (Feed)',
    },
  ],
  outputTypes: [
    {
      name: 'Twitter (Feed)',
      sockets: outputSockets,
      handler: async ({
        output,
        agent,
        event,
      }: {
        output: string;
        agent: any;
        event: any;
      }) => {
        await handleResponse({ output, agent, event });
      },
    },
  ],
  agentMethods: getAgentMethods(),
  secrets: [
    {
      name: 'Bearer Token (API v2)',
      key: 'twitter_bearer_token',
      global: false,
    },
    {
      name: 'API Key (API v1)',
      key: 'twitter_api_key',
      global: false,
    },
    {
      name: 'API Key Secret (API v1)',
      key: 'twitter_api_key_secret',
      global: false,
    },
    {
      name: 'Access Token (API v1)',
      key: 'twitter_access_token',
      global: false,
    },
    {
      name: 'Access Token Secret (API v1)',
      key: 'twitter_access_token_secret',
      global: false,
    },
  ],
});

// Export the TwitterPlugin as the default export
export default TwitterPlugin;