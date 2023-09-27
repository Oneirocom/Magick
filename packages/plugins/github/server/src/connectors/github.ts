import { app } from 'server/core'
import { Octokit } from '@octokit/rest'
import http from 'http'
import { Webhooks, createNodeMiddleware } from '@octokit/webhooks'
import ngrok from 'ngrok'
import { v4 as uuidv4 } from 'uuid'
import { getLogger } from 'shared/core'

export class GithubConnector {
  spellRunner
  data
  agent
  lastTime
  webhooks
  middleware
  webhookListeners = [] as any[]
  octokit
  secret
  numbers
  logger

  constructor({ spellRunner, agent }) {
    this.logger = getLogger()
    agent.github = this
    this.spellRunner = spellRunner
    const { data } = agent.data
    this.data = data
    this.agent = agent
    this.numbers = []
    this.initialize({ data })
  }

  async initialize({ data }) {
    if (!data.github_enabled) {
      this.logger.info('Github is not enabled, skipping')
    }

    if (!data.github_access_token) {
      this.logger.info('Github is not enabled for this agent')
    }

    this.logger.info(
      'Github enabled, initializing... %s, %o',
      data.github_access_token,
      data.github_repos
    )

    this.startWebhookServer()

    this.octokit = new Octokit({
      auth: data.github_access_token,
    })

    const repos = data.github_repos

    if (!repos) {
      this.logger.error(
        'Github repos not configured correctly. No repos found. skipping'
      )
      throw new Error(
        'Github repos not configured correctly. No repos found. skipping'
      )
    }

    // repos is an array of owner/repos, separated by comma
    // split it and add each repo to the webhook
    repos.forEach(async repo => {
      const [owner, name] = repo.trim().split('/')
      this.logger.info('**** GITHUB: Added repo %s, %s to webhook', owner, name)
      this.webhookListeners.push(
        await this.startNgrokAndConfigureWebhook(owner, name)
      )
    })
  }

  startWebhookServer() {
    this.secret = uuidv4()

    this.logger.info('webhook start >')
    this.webhooks = new Webhooks({
      secret: this.secret,
    })

    this.webhooks.on('pull_request.opened', ({ payload }) => {
      this.logger.info('payload pull_request: %o', payload.pull_request)
      const repo = {
        owner: payload.repository.owner.login,
        name: payload.repository.name,
      }
      this.newSpellInput('Pull Request', 'new_prs', payload.pull_request, repo)
    })

    this.webhooks.on('issues.opened', ({ payload }) => {
      this.logger.info('payload issue: %o', payload.issue)
      const repo = {
        owner: payload.repository.owner.login,
        name: payload.repository.name,
      }
      this.newSpellInput('Issue', 'new_issues', payload.issue, repo)
    })

    this.webhooks.on('issue_comment.created', ({ payload }) => {
      this.logger.info('payload comment: %o', payload.comment)
      const params = {
        ...payload.comment,
        number: payload.issue.number,
      }
      const repo = {
        owner: payload.repository.owner.login,
        name: payload.repository.name,
      }
      this.newSpellInput('Comment', 'issue_response', params, repo)
    })

    this.middleware = createNodeMiddleware(this.webhooks, {
      path: '/payload',
    })
  }

  async startNgrokAndConfigureWebhook(owner, repo) {
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

      let webhookId, repoWebhook
      this.logger.info('webhooks: %o', webhooks)
      // If the webhook exists, update it with the new configuration
      const events = [
        'issues',
        'issue_comment',
        'pull_request',
        'push',
        'repository',
      ]
      if (webhooks.length > 0) {
        const webhook = webhooks.find(hook => hook.config.url.includes('ngrok'))

        if (webhook) {
          webhookId = webhook.id
          webhook.config.port = randomPort
          webhook.config.url = ngrokUrl + '/payload'
          // config webhook secret
          webhook.config.secret = this.secret
          webhook.config.insecure_ssl = 0
          webhook.events = events

          await this.octokit.repos.updateWebhook({
            owner,
            repo,
            webhook_id: webhookId,
            ...webhook,
          })
          repoWebhook = webhook
          this.logger.info('updateWebhook: %o', webhook.data)
        }
      }

      // If the webhook doesn't exist, create a new one
      if (!webhookId) {
        this.logger.info('webhookId > null')
        const newWebhook = await this.octokit.repos.createWebhook({
          owner,
          repo,
          config: {
            url: ngrokUrl + '/payload',
            content_type: 'json',
            insecure_ssl: 0,
            port: randomPort,
            secret: this.secret,
          },
          events,
        })

        webhookId = newWebhook.data.id
        repoWebhook = newWebhook
        this.logger.info('createWebhook: %o', repoWebhook.data)
      }

      // createServer with randomPort
      http
        .createServer(async (req, res) => {
          if (await this.middleware(req, res)) return
          res.writeHead(404)
          res.end()
        })
        .listen(randomPort)

      this.logger.info(`Ngrok URL: ${ngrokUrl}`)
      this.logger.info(`Random Port: ${randomPort}`)
      this.logger.info(`Webhook ID: ${webhookId}`)
      return repoWebhook
    } catch (error) {
      this.logger.error('Error: %o', error)
      return null
    }
  }

  newSpellInput = async (
    pretext: string,
    type: string,
    content: any,
    repo: any
  ) => {
    const { number, title, body, id } = content
    const { owner, name } = repo
    const entities = [owner, name, title, body]
    return app.get('agentCommander').runSpell({
      inputs: {
        [`Input - Github (${pretext})`]: {
          connector: `Github (${pretext})`,
          content: body,
          sender: owner,
          observer: id,
          client: 'github',
          channel: number,
          agentId: this.agent.id,
          entities,
          channelType: type,
          rawData: JSON.stringify({
            number,
            title,
            body,
            id,
            owner,
            name,
          }),
        },
      },
      agentId: this.agent.id,
      spellId: this.agent.rootSpellId,
      agent: this.agent,
      secrets: this.agent.secrets,
      publicVariables: this.agent.publicVariables,
      runSubspell: true,
    })
  }

  createComment = async (
    data: any,
    number: number,
    repo: any,
    body: string,
    type: 'issue' | 'pull_request' | 'comment'
  ): Promise<any> => {
    const { github_access_token } = data
    const owner = repo[0]
    const name = repo[1]
    this.logger.info(
      'GITHUB CREATE COMMENT: type:%s, [%s, %s]',
      type,
      owner,
      name
    )
    try {
      if (!github_access_token || github_access_token[0] != 'g') {
        this.logger.info('github access token is invalid')
        return []
      }
      if (!owner || owner == '') {
        this.logger.info('owner/repo are invalid')
        return []
      }
      if (!name || name == '') {
        this.logger.info('owner/repo are invalid')
        return []
      }
      if (!number || !body) {
        this.logger.info('number/body are invalid')
        return null
      }

      const comment = await this.octokit.rest.issues.createComment({
        owner: owner,
        repo: name,
        issue_number: number,
        body,
      })
      this.logger.info(
        'new comment: %s, %o',
        comment.data.id,
        comment.data.body
      )

      return comment.data
    } catch (error) {
      this.logger.error('createComment error: %o', error)
      return null
    }
  }

  getNewIssues = async (data: any, repo: any) => {
    const { github_access_token } = data
    const { owner, name } = repo
    try {
      if (!github_access_token || github_access_token[0] != 'g') {
        this.logger.info('github access token is invalid')
        return []
      }
      if (!owner || owner == '') {
        this.logger.info('owner/repo are invalid')
        return []
      }
      if (!name || name == '') {
        this.logger.info('owner/repo are invalid')
        return []
      }

      const since = new Date(this.lastTime).toISOString()
      this.logger.info(`since = ${since}`)

      const newIssues = await this.octokit.rest.issues.listForRepo({
        owner: owner,
        repo: name,
        sort: 'created',
        direction: 'desc',
        since: since,
      })

      const filters = newIssues.data.filter(item => {
        const created = new Date(item.created_at).getTime()
        return created > this.lastTime
      })
      this.logger.info('new issues: %o', filters)

      return filters
    } catch (error) {
      this.logger.error('%o', error)
      return []
    }
  }

  getNewPRs = async (data: any, repo: any) => {
    const { github_access_token } = data
    const { owner, name } = repo
    try {
      if (!github_access_token || github_access_token[0] != 'g') {
        this.logger.info('github access token is invalid')
        return []
      }
      if (!owner || owner == '') {
        this.logger.info('owner/repo are invalid')
        return []
      }
      if (!name || name == '') {
        this.logger.info('owner/repo are invalid')
        return []
      }

      const newPRs = await this.octokit.rest.pulls.list({
        owner: owner,
        repo: name,
        sort: 'created',
        direction: 'desc',
      })

      const filters = newPRs.data.filter(item => {
        const created = new Date(item.created_at).getTime()
        return created > this.lastTime
      })

      this.logger.info('new PRs: %o', filters)

      return filters
    } catch (error) {
      this.logger.error('%o', error)
      return []
    }
  }

  getIssueComments = async (data: any, repo: any) => {
    const { github_access_token } = data
    const { owner, name } = repo
    try {
      if (!github_access_token || github_access_token[0] != 'g') {
        this.logger.info('github access token is invalid')
        return []
      }
      if (!owner || owner == '') {
        this.logger.info('owner/repo are invalid')
        return []
      }
      if (!name || name == '') {
        this.logger.info('owner/repo are invalid')
        return []
      }

      const since = new Date(this.lastTime).toISOString()

      const issueComments = await this.octokit.rest.issues.listCommentsForRepo({
        owner: owner,
        repo: name,
        sort: 'created',
        direction: 'desc',
        since: since,
      })

      this.logger.info('issue comments: %d', issueComments.data.length)

      return issueComments.data
    } catch (error) {
      this.logger.error('%o', error)
      return []
    }
  }

  async handleMessage(
    event: any,
    content: string,
    type: 'issue' | 'pull_request' | 'comment'
  ) {
    this.logger.info('handleMessage: %o, %s | %s', event, content, type)
    if (!content) {
      this.logger.error('output is undefined')
      return
    }
    if (!event.channel) {
      this.logger.error('number is undefined')
      return
    }
    if (!this.numbers) {
      this.logger.info('null >> ')
      this.numbers = []
    }
    if (type === 'comment') {
      const count = this.numbers.length
      this.numbers = this.numbers.filter(num => num != event.observer)
      if (this.numbers.length != count) {
        // is existed
        this.logger.error('duplicate created')
        return
      }
    }

    const comment = await this.createComment(
      this.data,
      event.channel,
      event.entities,
      content,
      type
    )
    if (comment) {
      this.numbers.push(comment.id)
    }
  }
}
