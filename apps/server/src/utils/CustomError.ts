export type CustomErrorCodes =
  | 'input-failed'
  | 'server-error'
  | 'not-found'
  | 'open-ai-error'
  | 'ai21-error'
  | 'coreweave-error'
  | 'forefront-error'
  | 'authentication-error'
  | `generation-model-error`

// eslint-disable-next-line functional/no-class
export class CustomError extends Error {
  public code: CustomErrorCodes
  public status: number
  public message: string
  public details?: string
  public constructor(
    code: CustomErrorCodes,
    message: string,
    details?: string
  ) {
    super()
    /* eslint-disable functional/no-this-expression */
    this.code = code
    this.message = message
    this.details = details
    this.status = mapStatusCode(code)
    /* eslint-enable functional/no-this-expression */
  }
}

export const mapStatusCode = (customErrorCode: CustomErrorCodes) => {
  switch (customErrorCode) {
    case 'input-failed':
      return 400
    case 'authentication-error':
      return 401
    case 'not-found':
      return 404
    case 'open-ai-error':
      return 502
    case 'coreweave-error':
      return 502
    case 'ai21-error':
      return 502
    case 'forefront-error':
      return 502
    case 'generation-model-error':
      return 502
    case 'server-error':
      return 500
  }
}
