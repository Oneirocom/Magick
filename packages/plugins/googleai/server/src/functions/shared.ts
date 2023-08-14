export function wordCount(s: string): number {
  return s.split(' ').filter(function (str) {
    return str != ''
  }).length
}
