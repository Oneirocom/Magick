// DOCUMENTED 
/**
 * Returns a boolean indicating whether a string starts with a capital letter.
 * @param word - The string to check.
 * @returns - A boolean indicating whether the string starts with a capital letter.
 */
export function startsWithCapital(word: string): boolean {
  return word.charAt(0) === word.charAt(0).toUpperCase();
}

/**
 * Logs one or more strings to the console.
 * @param s - One or more strings or booleans to log to the console.
 */
function log(...s: (string | boolean)[]): void {
  console.log(...s);
}

/**
 * Ethereum client class for interacting with the Ethereum network.
 */
export class EthereumClient {
  /**
   * Destroys the Ethereum client instance.
   */
  async destroy(): Promise<void> {
    await this.client.destroy();
    this.client = null;
  }

  /**
   * Returns the message corresponding to the specified message ID.
   * @param messageId - The ID of the requested message.
   * @returns - The message corresponding to the specified ID.
   */
  getMessage(messageId: string): string {
    return messageId;
  }

  /**
   * The Ethereum client instance.
   */
  client = {} as any;

  /**
   * The agent using the Ethereum client.
   */
  agent: any = undefined;

  /**
   * The spell runner for executing spells on the Ethereum network.
   */
  spellRunner: any = null;

  /**
   * Creates a new instance of the Ethereum client.
   * @param agent - The agent that will be using the Ethereum client.
   * @param spellRunner - The spell runner for executing spells on the Ethereum network.
   */
  createEthereumClient = async (
    agent: any,
    spellRunner: any,
  ): Promise<void> => {
    console.log('Creating Ethereum client');
    this.agent = agent;
    this.spellRunner = spellRunner;

    this.client = {
      "TODO": "TODO",
    };
    log('Ethereum client created');
  };
}

export default EthereumClient;
