// DOCUMENTED 
/**
 * OpenAI module namespace.
 *
 * @module OpenAI
 */
export namespace OpenAI {
  /**
   * Engine type.
   */
  export type Engine =
    | 'ada'
    | 'babbage'
    | 'curie'
    | 'davinci'
    | 'curie-instruct-beta'
    | 'davinci-instruct-beta';

  /**
   * Fine-tune model type.
   */
  export type FineTuneModel = 'ada' | 'babbage' | 'curie';

  /**
   * FineTune object.
   */
  export type FineTune = {
    id: string;
    object: 'fine-tune';
    model: FineTuneModel;
    createdAt: number;
    events: FineTuneEvent[];
    fine_tuned_model: string;
    hyperparams: Hyperparams;
    organization_id: string;
    result_files: File[];
    status: string;
    validation_files: File[];
    training_files: File[];
    updatedAt: number;
    user_id: string;
  };

  /**
   * FineTuneEvent object.
   */
  export type FineTuneEvent = {
    object: 'fine-tune-event';
    createdAt: number;
    level: string;
    message: string;
  };

  /**
   * Hyperparams object.
   */
  export type Hyperparams = {
    n_epochs?: number;
    batch_size?: number;
    learning_rate_multiplier?: number;
    use_packing?: boolean;
    prompt_loss_weight?: number;
  };

  /**
   * Purpose type.
   */
  export type Purpose =
    | 'search'
    | 'answers'
    | 'classifications'
    | 'fine-tune'
    | 'fine-tune-results';

  /**
   * File object.
   */
  export type File = {
    id: string;
    object: string;
    bytes: number;
    createdAt: number;
    filename: string;
    purpose: Purpose;
  };

  /**
   * List type with generic data type.
   */
  export type List<T> = {
    object: 'list';
    data: T[];
  };

  /**
   * FineTuneRequest object extends Hyperparams.
   */
  export interface FineTuneRequest extends Hyperparams {
    training_file: string;
    validation_file?: string;
    model?: FineTuneModel;
    compute_classification_metrics?: boolean;
    classification_n_classes?: number;
    classification_positive_class?: string;
    classification_betas?: number[];
  }

  /**
   * ErrorResponse object.
   */
  export type ErrorResponse = {
    error: {
      message: string;
    };
  };

  /**
   * Classifications namespace.
   */
  export namespace Classifications {
    /**
     * Request type.
     */
    export type Request = {
      file?: string;
      model: Engine;
      query: string;
    };

    /**
     * Response type.
     */
    export type Response = {
      label: string;
      model: string;
      search_model: string;
      selected_examples: Array<{
        document: number;
        label: string;
        score: number;
        text: string;
      }>;
      warnings?: Array<{ code: string; message: string }>;
    };
  }

  /**
   * Completions namespace.
   */
  export namespace Completions {
    /**
     * Request type.
     */
    export type Request = {
      model?: string;
      prompt?: string;
      n?: number;
      max_tokens?: number;
      temperature?: number;
    };

    /**
     * Response type.
     */
    export type Response = {
      choices: Array<{
        index: number;
        text: string;
      }>;
      model: string;
    };
  }

  /**
   * Search namespace.
   */
  export namespace Search {
    /**
     * Request type.
     */
    export type Request = {
      file?: string;
      query: string;
    };

    /**
     * Response type.
     */
    export type Response = {
      data: Array<{
        document: number;
        score: number;
        object: string;
        text: string;
      }>;
      model: string;
    };
  }
}