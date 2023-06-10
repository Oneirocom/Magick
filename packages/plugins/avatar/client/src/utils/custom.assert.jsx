/**
 * If cond is true, do nothing.  Otherwise, throw error with msg
 *
 * @param {boolean} cond Test condition
 * @param {string} msg path to the button icon
 * @throws If the condition is false
 */
export const customAssert = (cond, msg) => {
  if (cond) {
    return
  }
  throw new Error(msg)
}


/**
 * Equivalent to calling assertDefined on each parameter
 *
 * @param {any} args Variable length arguments to customAssert are defined
 * @return {any} args That was passed in
 * @throws If any argument is not defined
 */
export const assertDefined = (...args) => {
  for (const ndx in args) {
    if (Object.prototype.hasOwnProperty.call(args, ndx)) {
      const arg = args[ndx]
      customAssert(arg !== null && arg !== undefined, `Arg ${ndx} is not defined`)
    }
  }

  if (args.length === 1) {
    return args[0]
  }
  return args
}
