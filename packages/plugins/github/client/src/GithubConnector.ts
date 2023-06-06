import { Octokit } from '@octokit/rest'
import { Event } from '@magickml/core';
let commentUser: Event

export class GithubConnector {
  getGitHubRepos = async (accessToken) => {
    try {
      //@octokit/rest
      const octokit = new Octokit({
        auth: accessToken
      })
      const repo = await octokit.repos.listForAuthenticatedUser({
        visibility: 'all',
        per_page: 100
      })
      console.log("repo", repo.data)
      return repo.data
    } catch (error) {
      console.error(error)
      return []
    }
  }

  createIssue = async (accessToken, owner, repo, title, body) => {
    try {
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
      console.log("issue", issue)

      return issue
    } catch (error) {
      console.error(error)
      return []
    }
  }

  createPullrequest = async (accessToken, owner, repo, title, head, base, body) => {
    try {
      //@octokit/rest
      const octokit = new Octokit({
        auth: accessToken
      })

      const pullrequest = await octokit.pulls.create({
        owner: owner,
        repo: repo,
        title: title,
        head: head,
        base: base,
        body: body
      })

      console.log("pullrequest", pullrequest)

      return pullrequest
    } catch (error) {
      console.error(error)
      return []
    }
  }

  createIssueComment = async (accessToken, owner, repo, issue_number, body) => {
    try {
      //@octokit/rest
      const octokit = new Octokit({
        auth: accessToken
      })

      const issueComment = await octokit.issues.createComment({
        owner: owner,
        repo: repo,
        issue_number: issue_number,
        body: body
      })

      //Save user created issue
      commentUser.entities?.push(owner)

      console.log("issueComment", issueComment)

      return issueComment
    } catch (error) {
      console.error(error)
      return []
    }
  }

  searchIssuePullRequest = async (accessToken, query) => {
    try {
      //@octokit/rest
      const octokit = new Octokit({
        auth: accessToken
      })

      const searchResult = await octokit.search.issuesAndPullRequests({
        q: query,
        per_page: 100,
        page: 10
      })

      console.log("search result", searchResult)

      return searchResult
    } catch (error) {
      console.error(error)
      return []
    }
  }

  getIssueCommentMember = async () => {
    console.log("User", commentUser.entities)
    return commentUser
  }

}