/* eslint-disable @typescript-eslint/no-namespace */
export namespace OpenAI {
  export type Engine =
    | 'ada'
    | 'babbage'
    | 'curie'
    | 'davinci'
    | 'curie-instruct-beta'
    | 'davinci-instruct-beta'

  export type FineTuneModel = 'ada' | 'babbage' | 'curie'

  export type FineTune = {
    id: string
    object: 'fine-tune'
    model: FineTuneModel
    createdAt: number
    events: FineTuneEvent[]
    fine_tuned_model: string
    hyperparams: Hyperparams
    organization_id: string
    result_files: File[]
    status: string
    validation_files: File[]
    training_files: File[]
    updatedAt: number
    user_id: string
  }

  export type FineTuneEvent = {
    object: 'fine-tune-event'
    createdAt: number
    level: string
    message: string
  }

  export type Hyperparams = {
    n_epochs?: number
    batch_size?: number
    learning_rate_multiplier?: number
    use_packing?: boolean
    prompt_loss_weight?: number
  }

  export type Purpose =
    | 'search'
    | 'answers'
    | 'classifications'
    | 'fine-tune'
    | 'fine-tune-results'

  export type File = {
    id: string
    object: string
    bytes: number
    createdAt: number
    filename: string
    purpose: Purpose
  }

  export type List<T> = {
    object: 'list'
    data: T[]
  }

  export interface FineTuneRequest extends Hyperparams {
    training_file: string
    validation_file?: string
    model?: FineTuneModel
    compute_classification_metrics?: boolean
    classification_n_classes?: number
    classification_positive_class?: string
    classification_betas?: number[]
  }

  export type ErrorResponse = {
    error: {
      message: string
    }
  }

  // https://beta.openai.com/docs/api-reference/classifications/create
  export namespace Classifications {
    export type Request = {
      file?: string
      model: Engine
      query: string
    }

    export type Response = {
      label: string
      model: string
      search_model: string
      selected_examples: Array<{
        document: number
        label: string
        score: number
        text: string
      }>
      warnings?: Array<{ code: string; message: string }>
    }
  }

  // https://beta.openai.com/docs/api-reference/completions
  export namespace Completions {
    export type Request = {
      model?: string
      prompt?: string
      n?: number
      max_tokens?: number
      temperature?: number
    }

    export type Response = {
      choices: Array<{
        index: number
        text: string
      }>
      model: string
    }
  }

  // https://beta.openai.com/docs/api-reference/searches
  // eslint-disable-next-line @typescript-eslint/no-namespace
  export namespace Search {
    export type Request = {
      file?: string
      query: string
    }

    export type Response = {
      data: Array<{
        document: number
        score: number
        object: string
        text: string
      }>
      model: string
    }
  }
}
