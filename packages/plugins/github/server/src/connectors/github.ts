import { app } from '@magickml/server-core'
import { Octokit } from '@octokit/rest'
import { Webhooks, createNodeMiddleware } from '@octokit/webhooks'
import http from 'http'
import ngrok from 'ngrok'
import { v4 as uuidv4 } from 'uuid'

export class GithubConnector {
  spellRunner
  data
  agent
  lastTime: any
  webhooks: any
  webhookListeners = [] as any[]
  octokit: any
  secret: any

  constructor({ spellRunner, agent }) {
    agent.github = this
    this.spellRunner = spellRunner
    const { data } = agent.data
    this.data = data
    this.agent = agent

    this.initialize({ data })
  }

  async initialize({ data }: any) {
    if (!data.github_enabled) {
      console.warn('Github is not enabled, skipping')
    }

    if (!data.github_access_token) {
      console.warn('Github is not enabled for this agent')
    }

    console.log(
      'Github enabled, initializing...',
      data.github_access_token,
      data.github_repo_owner,
      data.github_repo_name
    )

    this.octokit = new Octokit({
      auth: data.github_access_token,
    })

    this.secret = uuidv4()

    const repos = data.github_repos

    console.log('repos is', repos)

    // repos is an array of owner/repos, separated by comma
    // split it and add each repo to the webhook
    repos?.split(',').forEach(
      async (repo: {
        trim: () => {
          (): any
          new (): any
          split: { (arg0: string): [any, any]; new (): any }
        }
      }) => {
        const [owner, name] = repo.trim().split('/')
        console.log('**** GITHUB: Added repo', owner, name, 'to webhook')
        this.webhookListeners.push(
          await this.startNgrokAndConfigureWebhook(owner, name)
        )
      }
    )

    console.log('webhook start')
    this.webhooks = new Webhooks({
      secret: this.secret,
    })

    this.webhooks.on('pull_request.opened', ({ payload }: any) => {
      console.log('payload pull_request', payload.pull_request)
      this.newSpellInput('Pull Request', 'new_prs', payload.pull_request)
    })

    this.webhooks.on('issues.opened', ({ payload }: any) => {
      console.log('payload issue', payload.issue)
      this.newSpellInput('Issue', 'new_issues', payload.issue)
    })

    this.webhooks.on('issue_comment.created', ({ payload }: any) => {
      console.log('payload comment', payload.comment)
      this.newSpellInput('Comment', 'issue_response', payload.comment)
    })

    const middleware = createNodeMiddleware(this.webhooks, {
      path: '/payload',
    })
    http
      .createServer(async (req, res) => {
        if (await middleware(req, res)) return
        res.writeHead(404)
        res.end()
      })
      .listen(4567)
  }

  async startNgrokAndConfigureWebhook(owner: any, repo: any) {
    try {
      // Generate a random port number between 4000 and 10000
      const randomPort = Math.floor(Math.random() * (10000 - 4000 + 1)) + 4000

      // Start ngrok with the random port and retrieve the URL
      const ngrokUrl = await ngrok.connect({
        addr: randomPort,
      })

      // Check if the webhook exists
      const { data: webhooks } = await this.octokit.repos.listWebhooks({
        owner,
        repo,
      })

      let webhookId

      // If the webhook exists, update it with the new configuration
      if (webhooks.length > 0) {
        const webhook = webhooks.find(
          (hook: { config: { url: string | string[] } }) =>
            hook.config.url.includes('ngrok')
        )

        if (webhook) {
          webhookId = webhook.id
          webhook.config.port = randomPort
          // config webhook secret
          webhook.config.secret = this.secret

          await this.octokit.repos.updateWebhook({
            owner,
            repo,
            webhook_id: webhookId,
            ...webhook,
          })
          return webhook
        }
      }

      // If the webhook doesn't exist, create a new one
      if (!webhookId) {
        const newWebhook = await this.octokit.repos.createWebhook({
          owner,
          repo,
          config: {
            url: ngrokUrl,
            content_type: 'json',
            insecure_ssl: '1',
            port: randomPort,
          },
        })

        webhookId = newWebhook.data.id
        return newWebhook
      }

      console.log('Ngrok URL:', ngrokUrl)
      console.log('Random Port:', randomPort)
      console.log('Webhook ID:', webhookId)
      return webhookId
    } catch (error) {
      console.error('Error:', error)
    }
  }

  newSpellInput = async (name: string, type: string, content: any) => {
    const { number, title, body } = content
    const entities = [
      this.data.github_repo_owner,
      this.data.github_repo_name,
      title,
      body,
    ]
    return this.spellRunner.runComponent({
      inputs: {
        [`Input - Github (${name})`]: {
          connector: `Github (${name})`,
          content: body,
          sender: this.data.github_repo_owner,
          observer: number,
          client: 'github',
          channel: 'github',
          agentId: this.agent.id,
          entities,
          channelType: type,
          rawData: JSON.stringify({ number, title, body }),
        },
      },
      agent: this.agent,
      secrets: this.agent.secrets,
      publicVariables: this.agent.publicVariables,
      app,
      runSubspell: true,
    })
  }

  createComment = async (
    data: any,
    number: number,
    body: string,
    type: 'issue' | 'pull_request' | 'comment'
  ) => {
    const { github_access_token, github_repo_owner, github_repo_name } = data
    console.log('GITHUB CREATE COMMENT: type', type)
    try {
      if (!github_access_token || github_access_token[0] != 'g') {
        console.log('github access token is invalid')
        return []
      }
      if (!github_repo_owner || github_repo_owner == '') {
        console.log('owner/repo are invalid')
        return []
      }
      if (!github_repo_name || github_repo_name == '') {
        console.log('owner/repo are invalid')
        return []
      }
      if (!number || !body) {
        console.log('number/body are invalid')
        return null
      }

      const comment = await this.octokit.rest.issues.createComment({
        owner: github_repo_owner,
        repo: github_repo_name,
        issue_number: number,
        body,
      })
      console.log('new comment', comment.data.id, comment.data.body)

      return comment.data
    } catch (error) {
      console.error(error)
      return null
    }
  }

  getNewIssues = async (data: any) => {
    const { github_access_token, github_repo_owner, github_repo_name } = data
    try {
      if (!github_access_token || github_access_token[0] != 'g') {
        console.log('github access token is invalid')
        return []
      }
      if (!github_repo_owner || github_repo_owner == '') {
        console.log('owner/repo are invalid')
        return []
      }
      if (!github_repo_name || github_repo_name == '') {
        console.log('owner/repo are invalid')
        return []
      }

      const since = new Date(this.lastTime).toISOString()
      console.log(since)

      const newIssues = await this.octokit.rest.issues.listForRepo({
        owner: github_repo_owner,
        repo: github_repo_name,
        sort: 'created',
        direction: 'desc',
        since: since,
      })

      const filters = newIssues.data.filter(
        (item: { created_at: string | number | Date }) => {
          const created = new Date(item.created_at).getTime()
          return created > this.lastTime
        }
      )
      console.log('new issues ', filters)

      return filters
    } catch (error) {
      console.error(error)
      return []
    }
  }

  getNewPRs = async (data: any) => {
    const { github_access_token, github_repo_owner, github_repo_name } = data
    try {
      if (!github_access_token || github_access_token[0] != 'g') {
        console.log('github access token is invalid')
        return []
      }
      if (!github_repo_owner || github_repo_owner == '') {
        console.log('owner/repo are invalid')
        return []
      }
      if (!github_repo_name || github_repo_name == '') {
        console.log('owner/repo are invalid')
        return []
      }

      const newPRs = await this.octokit.rest.pulls.list({
        owner: github_repo_owner,
        repo: github_repo_name,
        sort: 'created',
        direction: 'desc',
      })

      const filters = newPRs.data.filter(
        (item: { created_at: string | number | Date }) => {
          const created = new Date(item.created_at).getTime()
          return created > this.lastTime
        }
      )

      console.log('new PRs ', filters)

      return filters
    } catch (error) {
      console.error(error)
      return []
    }
  }

  getIssueComments = async (data: any) => {
    const { github_access_token, github_repo_owner, github_repo_name } = data
    try {
      if (!github_access_token || github_access_token[0] != 'g') {
        console.log('github access token is invalid')
        return []
      }
      if (!github_repo_owner || github_repo_owner == '') {
        console.log('owner/repo are invalid')
        return []
      }
      if (!github_repo_name || github_repo_name == '') {
        console.log('owner/repo are invalid')
        return []
      }

      const since = new Date(this.lastTime).toISOString()

      const issueComments = await this.octokit.rest.issues.listCommentsForRepo({
        owner: github_repo_owner,
        repo: github_repo_name,
        sort: 'created',
        direction: 'desc',
        since: since,
      })

      console.log('issue comments ', issueComments.data.length)

      return issueComments.data
    } catch (error) {
      console.error(error)
      return []
    }
  }

  async handleMessage(
    event: any,
    content: string,
    type: 'issue' | 'pull_request' | 'comment'
  ) {
    console.log('handleMessage', event, content, type)
    if (!content) {
      console.error('output is undefined')
      return
    }
    if (!event.observer) {
      console.error('number is undefined')
      return
    }

    await this.createComment(this.data, event.observer, content, type)
  }
}
