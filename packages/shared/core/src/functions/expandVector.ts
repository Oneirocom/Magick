export function expandVector(
  inputVector: number[],
  newLength: number
): number[] {
  const outputVector: number[] = []
  const inputLength = inputVector.length

  for (let i = 0; i < newLength; i++) {
    // calculate the proportional index in the inputVector
    const index = (i * (inputLength - 1)) / (newLength - 1)

    // find the indices of the two points to interpolate in the inputVector
    const index1 = Math.floor(index)
    const index2 = Math.min(index1 + 1, inputLength - 1)

    // calculate the interpolation weight for the second point
    const weight = index - index1

    // linearly interpolate between the two points
    const value =
      (1 - weight) * inputVector[index1] + weight * inputVector[index2]

    outputVector.push(value)
  }

  return outputVector
}
