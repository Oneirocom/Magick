import jsonDiff from 'json0-ot-diff'
import diffMatchPatch from 'diff-match-patch'

export const diff = (obj1, obj2) => jsonDiff(obj1, obj2, diffMatchPatch)
