---
id: "IRunContextEditor"
title: "Interface: IRunContextEditor"
sidebar_label: "IRunContextEditor"
sidebar_position: 0
custom_edit_url: null
---

## Hierarchy

- `NodeEditor`

  ↳ **`IRunContextEditor`**

  ↳↳ [`ModuleIRunContextEditor`](ModuleIRunContextEditor.md)

## Properties

### abort

• **abort**: () => `void`

#### Type declaration

▸ (): `void`

##### Returns

`void`

#### Defined in

[packages/engine/src/lib/types.ts:301](https://github.com/Oneirocom/MagickML/blob/c2f9e060/packages/engine/src/lib/types.ts#L301)

___

### components

• **components**: `Map`<`string`, `Component`\>

#### Inherited from

NodeEditor.components

#### Defined in

node_modules/rete/types/core/context.d.ts:8

___

### events

• **events**: `Object`

#### Index signature

▪ [key: `string`]: `Function`[]

#### Inherited from

NodeEditor.events

#### Defined in

node_modules/rete/types/core/emitter.d.ts:3

___

### id

• **id**: `string`

#### Inherited from

NodeEditor.id

#### Defined in

node_modules/rete/types/core/context.d.ts:6

___

### magick

• **magick**: [`EditorContext`](EditorContext.md)

#### Defined in

[packages/engine/src/lib/types.ts:300](https://github.com/Oneirocom/MagickML/blob/c2f9e060/packages/engine/src/lib/types.ts#L300)

___

### nodes

• **nodes**: `Node`[]

#### Inherited from

NodeEditor.nodes

#### Defined in

node_modules/rete/types/editor.d.ts:12

___

### plugins

• **plugins**: `Map`<`string`, `unknown`\>

#### Inherited from

NodeEditor.plugins

#### Defined in

node_modules/rete/types/core/context.d.ts:7

___

### selected

• **selected**: `Selected`

#### Inherited from

NodeEditor.selected

#### Defined in

node_modules/rete/types/editor.d.ts:13

___

### silent

• **silent**: `boolean`

#### Inherited from

NodeEditor.silent

#### Defined in

node_modules/rete/types/core/emitter.d.ts:6

___

### view

• **view**: `EditorView`

#### Inherited from

NodeEditor.view

#### Defined in

node_modules/rete/types/editor.d.ts:14

## Methods

### addNode

▸ **addNode**(`node`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `node` | `Node` |

#### Returns

`void`

#### Inherited from

NodeEditor.addNode

#### Defined in

node_modules/rete/types/editor.d.ts:16

___

### afterImport

▸ **afterImport**(): `boolean`

#### Returns

`boolean`

#### Inherited from

NodeEditor.afterImport

#### Defined in

node_modules/rete/types/editor.d.ts:26

___

### beforeImport

▸ **beforeImport**(`json`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `json` | `Data` |

#### Returns

`boolean`

#### Inherited from

NodeEditor.beforeImport

#### Defined in

node_modules/rete/types/editor.d.ts:25

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

NodeEditor.bind

#### Defined in

node_modules/rete/types/core/emitter.d.ts:10

___

### clear

▸ **clear**(): `void`

#### Returns

`void`

#### Inherited from

NodeEditor.clear

#### Defined in

node_modules/rete/types/editor.d.ts:23

___

### connect

▸ **connect**(`output`, `input`, `data?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `output` | `Output` |
| `input` | `Input` |
| `data?` | `unknown` |

#### Returns

`void`

#### Inherited from

NodeEditor.connect

#### Defined in

node_modules/rete/types/editor.d.ts:18

___

### destroy

▸ **destroy**(): `void`

#### Returns

`void`

#### Inherited from

NodeEditor.destroy

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

NodeEditor.exist

#### Defined in

node_modules/rete/types/core/emitter.d.ts:11

___

### fromJSON

▸ **fromJSON**(`json`): `Promise`<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `json` | `Data` |

#### Returns

`Promise`<`boolean`\>

#### Inherited from

NodeEditor.fromJSON

#### Defined in

node_modules/rete/types/editor.d.ts:27

___

### getComponent

▸ **getComponent**(`name`): `Component`

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |

#### Returns

`Component`

#### Inherited from

NodeEditor.getComponent

#### Defined in

node_modules/rete/types/editor.d.ts:21

___

### on

▸ **on**<`K`\>(`names`, `handler`): `Function`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends `string` \| `number` \| `symbol` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `names` | `K` \| `K`[] |
| `handler` | (`args`: `any`) => `unknown` |

#### Returns

`Function`

#### Inherited from

NodeEditor.on

#### Defined in

node_modules/rete/types/core/emitter.d.ts:8

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

NodeEditor.register

#### Defined in

node_modules/rete/types/editor.d.ts:22

___

### removeConnection

▸ **removeConnection**(`connection`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `connection` | `Connection` |

#### Returns

`void`

#### Inherited from

NodeEditor.removeConnection

#### Defined in

node_modules/rete/types/editor.d.ts:19

___

### removeNode

▸ **removeNode**(`node`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `node` | `Node` |

#### Returns

`void`

#### Inherited from

NodeEditor.removeNode

#### Defined in

node_modules/rete/types/editor.d.ts:17

___

### selectNode

▸ **selectNode**(`node`, `accumulate?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `node` | `Node` |
| `accumulate?` | `boolean` |

#### Returns

`void`

#### Inherited from

NodeEditor.selectNode

#### Defined in

node_modules/rete/types/editor.d.ts:20

___

### toJSON

▸ **toJSON**(): `Data`

#### Returns

`Data`

#### Inherited from

NodeEditor.toJSON

#### Defined in

node_modules/rete/types/editor.d.ts:24

___

### trigger

▸ **trigger**<`K`\>(`name`, `params?`): `boolean`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends `string` \| `number` \| `symbol` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `K` |
| `params?` | `any` |

#### Returns

`boolean`

#### Inherited from

NodeEditor.trigger

#### Defined in

node_modules/rete/types/core/emitter.d.ts:9

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

NodeEditor.use

#### Defined in

node_modules/rete/types/core/context.d.ts:10
