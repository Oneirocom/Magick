---
id: "SpellError"
title: "Class: SpellError"
sidebar_label: "SpellError"
sidebar_position: 0
custom_edit_url: null
---

A class used to represent a server error. Extends the built-in Error object

## Hierarchy

- `Error`

  ↳ **`SpellError`**

## Constructors

### constructor

• **new SpellError**(`code`, `message`, `details?`)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `code` | [`CustomErrorCodes`](../#customerrorcodes) | the code of the custom error |
| `message` | `string` | the error message |
| `details?` | `string` | additional details about the error (optional) |

#### Overrides

Error.constructor

#### Defined in

[packages/core/shared/src/utils/SpellError.ts:32](https://github.com/Oneirocom/Magick/blob/c560ff45/packages/core/shared/src/utils/SpellError.ts#L32)

## Properties

### code

• **code**: [`CustomErrorCodes`](../#customerrorcodes)

The code of the custom error

#### Defined in

[packages/core/shared/src/utils/SpellError.ts:18](https://github.com/Oneirocom/Magick/blob/c560ff45/packages/core/shared/src/utils/SpellError.ts#L18)

___

### details

• `Optional` **details**: `string`

Additional details about the error

#### Defined in

[packages/core/shared/src/utils/SpellError.ts:24](https://github.com/Oneirocom/Magick/blob/c560ff45/packages/core/shared/src/utils/SpellError.ts#L24)

___

### message

• **message**: `string`

The error message

#### Overrides

Error.message

#### Defined in

[packages/core/shared/src/utils/SpellError.ts:22](https://github.com/Oneirocom/Magick/blob/c560ff45/packages/core/shared/src/utils/SpellError.ts#L22)

___

### name

• **name**: `string`

#### Inherited from

Error.name

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1053

___

### stack

• `Optional` **stack**: `string`

#### Inherited from

Error.stack

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1055

___

### status

• **status**: `number`

The HTTP status code of the error

#### Defined in

[packages/core/shared/src/utils/SpellError.ts:20](https://github.com/Oneirocom/Magick/blob/c560ff45/packages/core/shared/src/utils/SpellError.ts#L20)

___

### prepareStackTrace

▪ `Static` `Optional` **prepareStackTrace**: (`err`: `Error`, `stackTraces`: `CallSite`[]) => `any`

#### Type declaration

▸ (`err`, `stackTraces`): `any`

Optional override for formatting stack traces

**`See`**

https://v8.dev/docs/stack-trace-api#customizing-stack-traces

##### Parameters

| Name | Type |
| :------ | :------ |
| `err` | `Error` |
| `stackTraces` | `CallSite`[] |

##### Returns

`any`

#### Inherited from

Error.prepareStackTrace

#### Defined in

node_modules/@types/node/globals.d.ts:11

___

### stackTraceLimit

▪ `Static` **stackTraceLimit**: `number`

#### Inherited from

Error.stackTraceLimit

#### Defined in

node_modules/@types/node/globals.d.ts:13

## Methods

### captureStackTrace

▸ `Static` **captureStackTrace**(`targetObject`, `constructorOpt?`): `void`

Create .stack property on a target object

#### Parameters

| Name | Type |
| :------ | :------ |
| `targetObject` | `object` |
| `constructorOpt?` | `Function` |

#### Returns

`void`

#### Inherited from

Error.captureStackTrace

#### Defined in

node_modules/@types/node/globals.d.ts:4
