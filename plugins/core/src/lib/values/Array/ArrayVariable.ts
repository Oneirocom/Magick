export type ArrayVariableData = {
  typeSignature: string
  data: any[]
  key?: string
}

export class ArrayVariable<T> extends Array<T> {
  private typeSignature = 'ArrayVariable'

  key?: string // Optional key, can be assigned later

  constructor(elements?: T[], key?: string) {
    console.log('CONSTRUCTING ARRAY VARIABLE')
    super(...(elements || []))
    this.key = key
  }

  // Optionally, provide a method to set the key
  setKey(newKey: string): void {
    this.key = newKey
  }

  // Custom toJSON method
  toJSON(): ArrayVariableData {
    console.log('TO JSON!!!')
    return {
      typeSignature: this.typeSignature,
      data: [...this], // Spread the array elements into a new array
      key: this.key,
    }
  }

  // Static method for deserialization
  static fromJSON<T>(json: string | ArrayVariableData): ArrayVariable<T> {
    if (typeof json === 'string') {
      json = JSON.parse(json)
    }

    const parsed = json as ArrayVariableData

    return new ArrayVariable<T>(parsed.data, parsed.key)
  }

  // Static method to check if an object is an ArrayVariable
  static isInstance(
    object: any
  ): object is ArrayVariable<any> | ArrayVariableData {
    return object?.typeSignature === 'ArrayVariable'
  }
}
