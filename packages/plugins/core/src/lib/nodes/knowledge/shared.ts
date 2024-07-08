export const validatePackId = (packId: any) => {
  if (typeof packId !== 'string' || packId === '' || packId === 'packId') {
    throw new Error(
      'Please select a knowledge pack from the Properties Window.'
    )
  }

  return packId
}
