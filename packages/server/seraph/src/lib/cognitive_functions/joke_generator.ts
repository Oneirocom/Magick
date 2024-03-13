import { BaseCognitiveFunction } from '../base_cognitive_function'
import { CognitiveFunctionSchema } from '../zod_schemas'

const jokeSchema: CognitiveFunctionSchema = {
  name: 'joke_generator',
  description: 'Generates a random joke based on the specified category.',
  parameters: {
    category: {
      type: 'string',
      description: 'The category of the joke.  Prograaming, puns, or dark',
    },
  },
  examples: ['Seraph: joke_generator --category=programming'],
}

class JokeGenerator extends BaseCognitiveFunction {
  constructor() {
    super(jokeSchema)
  }

  private getRandomJoke(category: string): string {
    // This is a simplified example with hard-coded jokes
    const jokes = {
      programming: [
        'Why did the developer go broke? Too many console.logs!',
        'Why do programmers prefer dark mode? Because light attracts bugs!',
        `Why did the developer quit their job? They didn't get arrays!`,
      ],
      puns: [
        'I tried to catch some fog earlier. I mist.',
        'I entered 10 pun competitions in a row. I thought I had won them all, no pun in one!',
        'What kind of music do planets listen to? Nep-tunes!',
      ],
      dark: [
        `Why don't scientists trust atoms? Because they make up everything!`,
        'I wondered why the baseball kept getting bigger. Then it hit me.',
        'What do you call a fake noodle? An Impasta.',
      ],
    }

    const categoryJokes = jokes[category]
    if (!categoryJokes) {
      return "Sorry, I don't have any jokes for that category."
    }

    const randomIndex = Math.floor(Math.random() * categoryJokes.length)
    return categoryJokes[randomIndex]
  }

  async execute(args: Record<string, any>): Promise<string> {
    const { category } = args
    const joke = this.getRandomJoke(category)
    return joke
  }
}

export { JokeGenerator }
