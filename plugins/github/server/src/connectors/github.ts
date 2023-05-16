import { app } from '@magickml/server-core'

export class GithubConnector {
  spellRunner
  data
  agent

  constructor({ spellRunner, agent }) {
    agent.github = this
    this.spellRunner = spellRunner
    const data = agent.data.data
    this.data = data
    this.agent = agent
    console.log(data)
    console.log('Github enabled, initializing...')
    this.initialize({ spellRunner, agent, data })
  }

  async initialize({ spellRunner, agent, data }) {

    if (!data.github_enabled) {
      console.warn('Github is not enabled, skipping')
    }

    if (!data.github_access_token) {
      console.warn('Github is not enabled for this agent')
    }

    const githubHandler = setInterval(async () => {
      console.log('running loop handler');
      const resp = await spellRunner.runComponent({
        inputs: {
          'Input - Github In': {
            content: 'github',
            sender: 'github',
            observer: agent.name,
            client: 'github',
            channel: 'auto',
            channelType: 'loop',
            projectId: agent.projectId,
            entities: [],
          },
        },
        agent: this.agent,
        secrets: this.agent.secrets,
        publicVariables: this.agent.publicVariables,
        app,
        runSubspell: true
      });
      console.log('output is', resp);
    },);
    agent.githubHandler = githubHandler;
    console.log('Added agent to github', agent.id);
  }
}




