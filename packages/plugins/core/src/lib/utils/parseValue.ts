export const parseValue = (value: any, valueType: string) => {
  switch (valueType) {
    case 'integer':
      return BigInt(value)
    case 'float':
      return parseFloat(value)
    case 'boolean':
      return Boolean(value)
    case 'string':
      return String(value)
    case 'array':
      return Array.isArray(value) ? value : [value]
    case 'object':
      return typeof value === 'object' ? value : {}
    default:
      return value
  }
}
