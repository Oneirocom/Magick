import Koa from 'koa'
import solc from 'solc'
import { ServerError, Route } from '@magickml/server-core'

const compileSolidity = async (ctx: Koa.Context) => {

  const { body } = ctx.request
  const { code } = body as any

  if (!body) throw new ServerError('input-failed', 'No parameters provided')

  var input = {
    language: 'Solidity',
    sources: {
      'code.sol': {
        content: code
      }
    },
    settings: {
      outputSelection: {
        '*': {
          '*': ['*']
        }
      }
    }
  };

  const output = JSON.parse(solc.compile(JSON.stringify(input)));

  ctx.response.status = 200
  return (ctx.body = {output})
}

export const sol: any[] = [
  {
    path: '/ethereum/compilee',
    post: compileSolidity,
  }
]
