export function isDiscordToken(str: string): boolean {
  if (
    /(mfa\.[a-z0-9_-]{20,})|([a-z0-9_-]{23,28}\.[a-z0-9_-]{6,7}\.[a-z0-9_-]{27})/i.test(
      str
    )
  )
    return true
  return false
}
