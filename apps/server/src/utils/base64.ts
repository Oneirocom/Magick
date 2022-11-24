// const encode64 = (str: string): string => {
//   return Buffer.from(str, 'utf-8').toString('base64')
// }

export const decode64 = (str: string): string => {
  return Buffer.from(str, 'base64').toString('utf-8')
}
