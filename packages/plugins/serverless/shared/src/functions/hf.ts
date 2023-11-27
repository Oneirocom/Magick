import { HfInference } from '@huggingface/inference'



export class HuggingFaceClient {
  private hf: HfInference

  constructor(token: string) {
    this.hf = new HfInference(token)
  }

  /**
   * Fills a masked input
   * @param input The input object containing the model and masked text.
   */
  async fillMask(input: { model: string | undefined; inputs: string }) {
    console.log('!fillMask', input)
    return this.hf.fillMask(input)
  }

  /**
   * Summarizes a provided text.
   * @param input The input object containing the model, text, and additional parameters.
   */
  async summarization(input: {
    model: string
    inputs: string
    parameters?: object
  }) {
    return (await this.hf.summarization(input)).summary_text
  }

  /**
   * Answers a question given a context.
   * @param input The input object containing the model, question, and context.
   */
  async questionAnswering(input: {
    model: string
    inputs: { question: string; context: string }
  }) {
    const test = {
      question: 'What is the capital of France?',
      context: 'The capital of France is Paris.',
    }
    return this.hf.questionAnswering({ ...input, inputs: test })
  }

  /**
   * Answers a question about a table.
   * @param input The input object containing the model, query, and table data.
   */
  async tableQuestionAnswering(input: {
    model: string
    inputs: {
      query: string
      table: {
        Repository: string[]
        Stars: string[]
        Contributors: string[]
        'Programming language': string[]
      }
    }
  }) {
    return this.hf.tableQuestionAnswering(input)
  }

  /**
   * Classifies provided text sentiment.
   * @param input The input object containing the model and text.
   */
  async textClassification(input: {
    model: string | undefined
    inputs: string
  }) {
    return this.hf.textClassification(input)
  }

  /**
   * Generates text based on provided prompt.
   * @param input The input object containing the model and input text.
   */
  async textGeneration(input: { model: string | undefined; inputs: string }) {
    return this.hf.textGeneration(input)
  }

  /**
   * Classifies tokens in provided text.
   * @param input The input object containing the model and text.
   */
  async tokenClassification(input: {
    model: string | undefined
    inputs: string
  }) {
    return this.hf.tokenClassification(input)
  }

  /**
   * Translates provided text.
   * @param input The input object containing the model and text.
   */
  async translation(input: { model: string | undefined; inputs: string }) {
    return this.hf.translation(input)
  }

  /**
   * Classifies text based on zero-shot learning.
   * @param input The input object containing the model, text, and candidate labels.
   */
  async zeroShotClassification(input: {
    model: string
    inputs: string[]
    parameters: { candidate_labels: string[] }
  }) {
    return this.hf.zeroShotClassification(input)
  }

  /**
   * Simulates a conversational interaction.
   * @param input The input object containing the model and past interactions.
   */
  async conversational(input: {
    model: string
    inputs: {
      past_user_inputs: string[]
      generated_responses: string[]
      text: string
    }
  }) {
    return this.hf.conversational(input)
  }

  /**
   * Compares source sentence similarity with other sentences.
   * @param input The input object containing the model, source sentence, and other sentences.
   */
  async sentenceSimilarity(input: {
    model: string
    inputs: {
      source_sentence: string
      sentences: string[]
    }
  }) {
    return this.hf.sentenceSimilarity(input)
  }

  /**
   * Extracts features from provided text.
   * @param input The input object containing the model and text.
   */
  async featureExtraction(input: {
    model: string | undefined
    inputs: string
  }) {
    return this.hf.featureExtraction(input)
  }

  /**
   * Performs automatic speech recognition on audio data.
   * @param input The input object containing the model and audio data.
   */
  async automaticSpeechRecognition(input: {
    model: string | undefined
    data: Buffer
  }) {
    return this.hf.automaticSpeechRecognition(input)
  }

  /**
   * Classifies audio data.
   * @param input The input object containing the model and audio data.
   */
  async audioClassification(input: {
    model: string | undefined
    data: Buffer
  }) {
    return this.hf.audioClassification(input)
  }

  /**
   * Converts text to speech.
   * @param input The input object containing the model and text.
   */
  async textToSpeech(input: { model: string | undefined; inputs: string }) {
    return this.hf.textToSpeech(input)
  }

  /**
   * Transforms audio to audio.
   * @param input The input object containing the model and audio data.
   */
  async audioToAudio(input: { model: string | undefined; data: Buffer }) {
    return this.hf.audioToAudio(input)
  }

  /**
   * Classifies images.
   * @param input The input object containing the model and image data.
   */
  async imageClassification(input: {
    model: string | undefined
    data: Buffer
  }) {
    return this.hf.imageClassification(input)
  }

  /**
   * Detects objects in images.
   * @param input The input object containing the model and image data.
   */
  async objectDetection(input: { model: string | undefined; data: Buffer }) {
    return this.hf.objectDetection(input)
  }

  /**
   * Performs image segmentation.
   * @param input The input object containing the model and image data.
   */
  async imageSegmentation(input: { model: string | undefined; data: Buffer }) {
    return this.hf.imageSegmentation(input)
  }

  /**
   * Converts text to image.
   * @param input The input object containing the model, text, and optional parameters.
   */
  async textToImage(input: {
    model: string
    inputs: string
    parameters?: {
      negative_prompt?: string
    }
  }) {
    return this.hf.textToImage(input)
  }

  /**
   * Converts image to text.
   * @param input The input object containing the model and image data.
   */
  async imageToText(input: { model: string | undefined; data: Buffer }) {
    return this.hf.imageToText(input)
  }

  /**
   * Transforms image to image.
   * @param input The input object containing the model, image data, and optional parameters.
   */
  async imageToImage(input: {
    model: string
    inputs: Buffer
    parameters?: {
      prompt?: string
    }
  }) {
    return this.hf.imageToImage(input)
  }

  /**
   * Classifies images using zero-shot learning.
   * @param input The input object containing the model, image data or URL, and candidate labels.
   */
  async zeroShotImageClassification(input: {
    model: string
    inputs: {
      image: Buffer | Blob
    }
    parameters: {
      candidate_labels: string[]
    }
  }) {
    return this.hf.zeroShotImageClassification(input)
  }

  async visualQuestionAnswering(input: {
    model: string
    inputs: {
      question: string
      image: Blob
    }
  }) {
    return this.hf.visualQuestionAnswering(input)
  }

  /**
   * Answers questions based on a document image.
   * @param input The input object containing the model, question, and image data.
   */
  async documentQuestionAnswering(input: {
    model: string
    inputs: {
      question: string
      image: Blob
    }
  }) {
    return this.hf.documentQuestionAnswering(input)
  }

  /**
   * Performs regression on tabular data.
   * @param input The input object containing the model and data.
   */
  async tabularRegression(input: {
    model: string
    inputs: {
      data: {
        Height: string[]
        Length1: string[]
        Length2: string[]
        Length3: string[]
        Species: string[]
        Width: string[]
      }
    }
  }) {
    return this.hf.tabularRegression(input)
  }

  /**
   * Performs classification on tabular data.
   * @param input The input object containing the model and data.
   */
  async tabularClassification(input: {
    model: string
    inputs: {
      data: {
        fixed_acidity: string[]
        volatile_acidity: string[]
        citric_acid: string[]
        residual_sugar: string[]
        chlorides: string[]
        free_sulfur_dioxide: string[]
        total_sulfur_dioxide: string[]
        density: string[]
        pH: string[]
        sulphates: string[]
        alcohol: string[]
      }
    }
  }) {
    return this.hf.tabularClassification(input)
  }

  /**
   * Custom request call for models with custom parameters or outputs.
   * @param input The input object containing the model, inputs, and custom parameters.
   */
  async customRequest(input: {
    model: string
    inputs: string
    parameters?: {
      custom_param: string
    }
  }) {
    return this.hf.request(input)
  }
}
