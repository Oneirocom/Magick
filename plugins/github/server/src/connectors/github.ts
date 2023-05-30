import { app } from '@magickml/server-core'
import { Octokit } from '@octokit/rest'
import http from 'http'
import { Webhooks, createNodeMiddleware } from '@octokit/webhooks'

export class GithubConnector {
  spellRunner
  data
  agent
  lastTime
  webhooks

  constructor({ spellRunner, agent }) {
    agent.github = this
    this.spellRunner = spellRunner
    const { data } = agent.data
    this.data = data
    this.agent = agent
    
    this.initialize({ agent, data })
  }

  async initialize({ agent, data }) {
    console.log('Github enabled, initializing...', data.github_access_token, data.github_repo_owner, data.github_repo_name)

    if (!data.github_enabled) {
      console.warn('Github is not enabled, skipping')
    }

    if (!data.github_access_token) {
      console.warn('Github is not enabled for this agent')
    }

    const webhookSecret = data.github_webhooks_secret

    if (!webhookSecret || webhookSecret == '') {

      const githubHandler = setInterval(async () => {
        console.log('running github handler')

        this.lastTime = Date.now() - 30000

        const newIssues = await this.getNewIssues(data)
        if (newIssues.length > 0) {
          newIssues.forEach(async (item) => {
            await this.newSpellInput('New Issues', 'new_issues', item)
          })        
        }

        const newPRs = await this.getNewPRs(data)
        if (newPRs.length > 0) {
          newPRs.forEach(async (item) => {
            await this.newSpellInput('New PRs', 'new_prs', item)
          })
        }

        const issueComments = await this.getIssueComments(data)
        if (issueComments.length > 0) {
          issueComments.forEach(async (item) => {
            await this.newSpellInput('Issue Response', 'issue_response', item)
          })
        }
      }, 30000)

      agent.githubHandler = githubHandler
      console.log('Added agent to github', agent.id)
    } else {
      console.log('webhook start')
      this.webhooks = new Webhooks({
        secret: webhookSecret,
      })
      
      this.webhooks.on('pull_request.opened',({ payload }) => {
        console.log("payload pull_request", payload.pull_request)
        this.newSpellInput('New PRs', 'new_prs', payload.pull_request)
      })

      this.webhooks.on('issues.opened',({ payload }) => {
        console.log("payload issue", payload.issue)
        this.newSpellInput('New Issues', 'new_issues', payload.issue)
      })

      this.webhooks.on('issue_comment.created',({ payload }) => {
        console.log("payload comment", payload.comment)
        this.newSpellInput('Issue Response', 'issue_response', payload.comment)
      })
      
      const middleware = createNodeMiddleware(this.webhooks, { path: "/payload" })
      http.createServer(async (req, res) => {
        if (await middleware(req, res)) return
        res.writeHead(404)
        res.end()
      }).listen(4567)
    }
  }

  newSpellInput = async (name: string, type: string, content: any) => {
    const {number, title, body} = content
    const entities = [this.data.github_repo_owner, this.data.github_repo_name, title, body]
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
          rawData: JSON.stringify({number, title, body}),
        },
      },
      agent: this.agent,
      secrets: this.agent.secrets,
      publicVariables: this.agent.publicVariables,
      app,
      runSubspell: true
    })
  }

  createComment = async (data: any, number: number, body: string) => {
    const {github_access_token, github_repo_owner, github_repo_name} = data
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

      //@octokit/rest
      const octokit = new Octokit({
        auth: github_access_token
      })
      
      const comment = await octokit.rest.issues.createComment({
        owner: github_repo_owner,
        repo: github_repo_name,
        issue_number: number,
        body
      })
      console.log('new comment', comment.data.id, comment.data.body)

      return comment.data
    } catch (error) {
      console.error(error)
      return null
    }
  }

  getNewIssues = async (data: any) => {
    const {github_access_token, github_repo_owner, github_repo_name} = data
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

      //@octokit/rest
      const octokit = new Octokit({
        auth: github_access_token
      })

      const since = new Date(this.lastTime).toISOString()
      console.log(since)

      const newIssues = await octokit.rest.issues.listForRepo({
        owner: github_repo_owner,
        repo: github_repo_name,
        sort: 'created',
        direction: 'desc',
        since: since
      })

      const filters = newIssues.data.filter((item) => {
        const created = new Date(item.created_at).getTime()
        return (created > this.lastTime)
      })
      console.log("new issues ", filters)

      return filters
    } catch (error) {
      console.error(error)
      return []
    }
  }

  getNewPRs = async (data: any) => {
    const {github_access_token, github_repo_owner, github_repo_name} = data
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

      //@octokit/rest
      const octokit = new Octokit({
        auth: github_access_token
      })

      const newPRs = await octokit.rest.pulls.list({
        owner: github_repo_owner,
        repo: github_repo_name,
        sort: 'created',
        direction: 'desc',
      })

      const filters = newPRs.data.filter((item) => {
        const created = new Date(item.created_at).getTime()
        return (created > this.lastTime)
      })

      console.log("new PRs ", filters)

      return filters
    } catch (error) {
      console.error(error)
      return []
    }
  }

  getIssueComments = async (data: any) => {
    const {github_access_token, github_repo_owner, github_repo_name} = data
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

      //@octokit/rest
      const octokit = new Octokit({
        auth: github_access_token
      })

      const since = new Date(this.lastTime).toISOString()

      const issueComments = await octokit.rest.issues.listCommentsForRepo({
        owner: github_repo_owner,
        repo: github_repo_name,
        sort: 'created',
        direction: 'desc',
        since: since
      })

      console.log("issue comments ", issueComments.data.length)

      return issueComments.data
    } catch (error) {
      console.error(error)
      return []
    }
  }

  async handleMessage(event: any, content: string) {
    console.log('handleMessage', event)
    console.log('content', content)
    if (!content) {
      console.error('output is undefined')
      return
    }
    if (!event.observer) {
      console.error('number is undefined')
      return
    }

    await this.createComment(this.data, event.observer, content)
  }
}

