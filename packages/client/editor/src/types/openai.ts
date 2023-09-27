export namespace OpenAI {
  export interface List<T> {
    data: T[]
  }

  export interface FineTune {
    fine_tuned_model: any
  }
}
