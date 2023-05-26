import { app } from '@magickml/server-core'
import { Octokit } from '@octokit/rest'

export class GithubConnector {
  spellRunner
  data
  agent

  constructor({ spellRunner, agent }) {
    agent.github = this
    this.spellRunner = spellRunner
    const { data } = agent.data
    this.data = data
    this.agent = agent

    console.log('Github enabled, initializing...', data.github_access_token, data.github_repo_owner, data.github_repo_name)
    this.initialize({ agent, data })
  }

  async initialize({ agent, data }) {

    if (!data.github_enabled) {
      console.warn('Github is not enabled, skipping')
    }

    if (!data.github_access_token) {
      console.warn('Github is not enabled for this agent')
    }

    const githubHandler = setInterval(async () => {
      console.log('running github handler')

      const newIssues = await this.getNewIssues(data.github_access_token, data.github_repo_owner, data.github_repo_name)

      await this.newSpellInput('New Issues', 'new_issues', newIssues)

      const newPRs = await this.getNewPRs(data.github_access_token, data.github_repo_owner, data.github_repo_name)

      await this.newSpellInput('New PRs', 'new_prs', newPRs)

      const issueComments = await this.getIssueComments(data.github_access_token, data.github_repo_owner, data.github_repo_name)

      await this.newSpellInput('Issue Response', 'issue_response', issueComments)

    }, 30000);
    agent.githubHandler = githubHandler
    console.log('Added agent to github', agent.id)
  }

  newSpellInput = async (name: string, type: string, content: any) => {
    const entities = [this.data.github_repo_owner, this.data.github_access_token]
    return this.spellRunner.runComponent({
      inputs: {
        [`Input - Github (${name})`]: {
          connector: `Github (${name})`,
          content: JSON.stringify(content),
          sender: this.data.github_repo_owner,
          observer: this.data.github_access_token,
          client: 'github',
          channel: 'github',
          agentId: this.agent.id,
          entities,
          channelType: type,
          rawData: JSON.stringify(content),
        },
      },
      agent: this.agent,
      secrets: this.agent.secrets,
      publicVariables: this.agent.publicVariables,
      app,
      runSubspell: true
    })
  }

  createIssue = async (accessToken: string, owner: string, repo: string, title: string, body: string) => {
    try {
      if (accessToken == undefined || accessToken == '' || accessToken[0] != 'g') {
        console.log('github access token is invalid')
        return null
      }
      if (!owner || owner == '' || !repo || repo == '') {
        console.log('owner/repo are invalid')
        return null
      }
      if (!title || title == '' || !body) {
        console.log('title/body are invalid')
        return null
      }

      //@octokit/rest
      const octokit = new Octokit({
        auth: accessToken
      })

      console.log(accessToken, owner, repo, title, body)
      const issue = await octokit.rest.issues.create({
        owner: owner,
        repo: repo,
        title: title,
        body: body
      })
      console.log('issue', issue)

      return issue
    } catch (error) {
      console.error(error)
      return null
    }
  }

  getNewIssues = async (accessToken: string, owner: string, repo: string) => {
    try {
      if (accessToken == undefined || accessToken == '' || accessToken[0] != 'g') {
        console.log('github access token is invalid')
        return []
      }
      if (!owner || owner == '' || !repo || repo == '') {
        console.log('owner/repo are invalid')
        return []
      }

      //@octokit/rest
      const octokit = new Octokit({
        auth: accessToken
      })

      const newIssues = await octokit.rest.issues.listForRepo({
        owner: owner,
        repo: repo,
        sort: 'created'
      })

      console.log("new issues ", newIssues.data.length)

      return newIssues.data
    } catch (error) {
      console.error(error)
      return []
    }
  }

  getNewPRs = async (accessToken: string, owner: string, repo: string) => {
    try {
      if (accessToken == undefined || accessToken == '' || accessToken[0] != 'g') {
        console.log('github access token is invalid')
        return []
      }
      if (!owner || owner == '' || !repo || repo == '') {
        console.log('owner/repo are invalid')
        return []
      }

      //@octokit/rest
      const octokit = new Octokit({
        auth: accessToken
      })

      const newPRs = await octokit.rest.pulls.list({
        owner: owner,
        repo: repo,
        sort: 'created'
      })

      console.log("new PRs ", newPRs.data.length)

      return newPRs.data
    } catch (error) {
      console.error(error)
      return []
    }
  }

  getIssueComments = async (accessToken: string, owner: string, repo: string) => {
    try {
      if (accessToken == undefined || accessToken == '' || accessToken[0] != 'g') {
        console.log('github access token is invalid')
        return []
      }
      if (!owner || owner == '' || !repo || repo == '') {
        console.log('owner/repo are invalid')
        return []
      }

      //@octokit/rest
      const octokit = new Octokit({
        auth: accessToken
      })

      const issueComments = await octokit.rest.issues.listCommentsForRepo({
        owner: owner,
        repo: repo
      })

      console.log("issue comments ", issueComments.data.length)

      return issueComments.data
    } catch (error) {
      console.error(error)
      return []
    }
  }

  async handleMessage(response, info) {
    console.log('handleMessage', response)
    const token = this.data.github_access_token
    const owner = this.data.github_repo_owner
    const repo = this.data.github_repo_name

    if (info == '') {
      return []
    }

    let json = {}
    try {
      json = JSON.parse(info)
    } catch (err) {
      console.error(err)
    }

    const res = await this.createIssue(token, owner, repo, json['title'], json['content'])

    if (!res) {
      return null
    }

    return res
  }
}

