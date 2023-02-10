export type CustomErrorCodes =
  | 'input-failed'
  | 'server-error'
  | 'not-found'
  | 'already-exists'
  | 'authentication-error'

// eslint-disable-next-line functional/no-class
export class ServerError extends Error {
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
    case 'already-exists':
      return 239
    case 'not-found':
      return 404
    case 'server-error':
      return 500
  }
}
