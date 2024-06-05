import { zString } from './zstring.primitive'
import { StringValue } from './zstring.value'
import { Constant } from './zstring.nodes'
import { testExec } from '../utils/tests'

describe('zString Tests', () => {
  it('should validate a string', () => {
    expect(zString.parse('test')).toBe('test')
    expect(() => zString.parse(123)).toThrow()
  })

  it('should validate StringValue operations', () => {
    expect(StringValue.deserialize('test')).toBe('test')
    expect(StringValue.serialize('test')).toBe('test')
    expect(StringValue.lerp('a', 'b', 0.3)).toBe('a')
    expect(StringValue.lerp('a', 'b', 0.7)).toBe('b')
    expect(StringValue.equals('test', 'test')).toBe(true)
    expect(StringValue.equals('test', 'fail')).toBe(false)
    expect(StringValue.clone('test')).toBe('test')
  })

  it('should validate zString nodes', () => {
    let outputs = testExec({
      exec: Constant.exec,
      nodeInputVals: { a: 'test' },
    })
    expect(outputs['a']).toBe('test')

    // outputs = testExec({
    //   exec: Concat.exec,
    //   nodeInputVals: { a: 'hello', b: 'world' },
    // })
    // expect(outputs['a']).toBe('helloworld')

    // outputs = testExec({
    //   exec: Includes.exec,
    //   nodeInputVals: { a: 'hello world', b: 'world' },
    // })
    // expect(outputs['a']).toBe(true)

    // outputs = testExec({
    //   exec: Length.exec,
    //   nodeInputVals: { a: 'hello' },
    // })
    // expect(outputs['a']).toBe(BigInt(5))

    // outputs = testExec({
    //   exec: StringEqual.exec,
    //   nodeInputVals: { a: 'test', b: 'test' },
    // })
    // expect(outputs['a']).toBe(true)
  })
})
