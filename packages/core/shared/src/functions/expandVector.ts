export default function expandVector(
  inputVector: number[],
  newLength: number
): number[] {
  let outputVector: number[] = []
  let inputLength = inputVector.length

  for (let i = 0; i < newLength; i++) {
    // calculate the proportional index in the inputVector
    let index = (i * (inputLength - 1)) / (newLength - 1)

    // find the indices of the two points to interpolate in the inputVector
    let index1 = Math.floor(index)
    let index2 = Math.min(index1 + 1, inputLength - 1)

    // calculate the interpolation weight for the second point
    let weight = index - index1

    // linearly interpolate between the two points
    let value =
      (1 - weight) * inputVector[index1] + weight * inputVector[index2]

    outputVector.push(value)
  }

  return outputVector
}
