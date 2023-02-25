export function startsWithCapital(word) {
  return word.charAt(0) === word.charAt(0).toUpperCase()
}
function log(...s: (string | boolean)[]) {
  console.log(...s)
}

export class ethereum_client {
  async destroy() {
    await this.client.destroy()
    this.client = null
  }
  getMessage(
    messageId: string
  ) {
    return messageId
  }

  client = {} as any
  agent = undefined
  spellRunner = null

  createEthereumClient = async (
    agent: any,
    spellRunner: any,
  ) => {
    console.log('creating ethereum client')
    this.agent = agent
    this.spellRunner = spellRunner

    this.client = {
      "TODO": "TODO"
    }
    log('created ethereum client')
  }
}

export default ethereum_client
