---
id: "MagickEngine"
title: "Interface: MagickEngine"
sidebar_label: "MagickEngine"
sidebar_position: 0
custom_edit_url: null
---

## Hierarchy

- `Engine`

  ↳ **`MagickEngine`**

## Properties

### args

• **args**: `unknown`[]

#### Inherited from

Engine.args

#### Defined in

node_modules/rete/types/engine/index.d.ts:13

___

### components

• **components**: `Map`<`string`, `Component`\>

#### Inherited from

Engine.components

#### Defined in

node_modules/rete/types/core/context.d.ts:8

___

### data

• **data**: ``null`` \| `Data`

#### Inherited from

Engine.data

#### Defined in

node_modules/rete/types/engine/index.d.ts:14

___

### events

• **events**: `Object`

#### Index signature

▪ [key: `string`]: `Function`[]

#### Inherited from

Engine.events

#### Defined in

node_modules/rete/types/core/emitter.d.ts:3

___

### id

• **id**: `string`

#### Inherited from

Engine.id

#### Defined in

node_modules/rete/types/core/context.d.ts:6

___

### moduleManager

• **moduleManager**: [`ModuleManager`](../classes/ModuleManager.md)

#### Defined in

[packages/engine/src/lib/engine.ts:21](https://github.com/Oneirocom/MagickML/blob/dcf6d21c/packages/engine/src/lib/engine.ts#L21)

___

### onAbort

• **onAbort**: () => `void`

#### Type declaration

▸ (): `void`

##### Returns

`void`

#### Inherited from

Engine.onAbort

#### Defined in

node_modules/rete/types/engine/index.d.ts:16

___

### plugins

• **plugins**: `Map`<`string`, `unknown`\>

#### Inherited from

Engine.plugins

#### Defined in

node_modules/rete/types/core/context.d.ts:7

___

### silent

• **silent**: `boolean`

#### Inherited from

Engine.silent

#### Defined in

node_modules/rete/types/core/emitter.d.ts:6

___

### state

• **state**: `number`

#### Inherited from

Engine.state

#### Defined in

node_modules/rete/types/engine/index.d.ts:15

___

### tasks

• **tasks**: [`Task`](../classes/Task.md)[]

#### Defined in

[packages/engine/src/lib/engine.ts:19](https://github.com/Oneirocom/MagickML/blob/dcf6d21c/packages/engine/src/lib/engine.ts#L19)

## Methods

### abort

▸ **abort**(): `Promise`<{}\>

#### Returns

`Promise`<{}\>

#### Inherited from

Engine.abort

#### Defined in

node_modules/rete/types/engine/index.d.ts:22

___

### bind

▸ **bind**(`name`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |

#### Returns

`void`

#### Inherited from

Engine.bind

#### Defined in

node_modules/rete/types/core/emitter.d.ts:10

___

### clone

▸ **clone**(): `Engine`

#### Returns

`Engine`

#### Inherited from

Engine.clone

#### Defined in

node_modules/rete/types/engine/index.d.ts:18

___

### copy

▸ **copy**(`data`): `Data`

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `Data` |

#### Returns

`Data`

#### Inherited from

Engine.copy

#### Defined in

node_modules/rete/types/engine/index.d.ts:29

___

### destroy

▸ **destroy**(): `void`

#### Returns

`void`

#### Inherited from

Engine.destroy

#### Defined in

node_modules/rete/types/core/context.d.ts:12

___

### exist

▸ **exist**(`name`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |

#### Returns

`boolean`

#### Inherited from

Engine.exist

#### Defined in

node_modules/rete/types/core/emitter.d.ts:11

___

### on

▸ **on**<`K`\>(`names`, `handler`): `Function`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends keyof `EventsTypes` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `names` | `K` \| `K`[] |
| `handler` | (`args`: `EventsTypes` & `EventsTypes`[`K`]) => `unknown` |

#### Returns

`Function`

#### Inherited from

Engine.on

#### Defined in

node_modules/rete/types/core/emitter.d.ts:8

___

### process

▸ **process**<`T`\>(`data`, `startId?`, `...args`): `Promise`<``"success"`` \| ``"aborted"``\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `unknown`[] |

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `Data` |
| `startId?` | ``null`` \| `string` \| `number` |
| `...args` | `T` |

#### Returns

`Promise`<``"success"`` \| ``"aborted"``\>

#### Inherited from

Engine.process

#### Defined in

node_modules/rete/types/engine/index.d.ts:33

___

### register

▸ **register**(`component`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `component` | `Component` |

#### Returns

`void`

#### Inherited from

Engine.register

#### Defined in

node_modules/rete/types/core/context.d.ts:11

___

### throwError

▸ **throwError**(`message`, `data?`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | `string` |
| `data?` | `unknown` |

#### Returns

`Promise`<`string`\>

#### Inherited from

Engine.throwError

#### Defined in

node_modules/rete/types/engine/index.d.ts:19

___

### trigger

▸ **trigger**<`K`\>(`name`, `params?`): `boolean`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends keyof `EventsTypes` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `K` |
| `params?` | {} \| `EventsTypes` & `EventsTypes`[`K`] |

#### Returns

`boolean`

#### Inherited from

Engine.trigger

#### Defined in

node_modules/rete/types/core/emitter.d.ts:9

___

### unlock

▸ **unlock**(`node`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `node` | `EngineNode` |

#### Returns

`void`

#### Inherited from

Engine.unlock

#### Defined in

node_modules/rete/types/engine/index.d.ts:24

___

### use

▸ **use**<`T`, `O`\>(`plugin`, `options?`): `void`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `Plugin` |
| `O` | extends `unknown` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `plugin` | `T` |
| `options?` | `O` |

#### Returns

`void`

#### Inherited from

Engine.use

#### Defined in

node_modules/rete/types/core/context.d.ts:10

___

### validate

▸ **validate**(`data`): `Promise`<`string` \| ``true``\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `Data` |

#### Returns

`Promise`<`string` \| ``true``\>

#### Inherited from

Engine.validate

#### Defined in

node_modules/rete/types/engine/index.d.ts:30
