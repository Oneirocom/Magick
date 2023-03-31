---
id: "engine_src.ModuleIRunContextEditor"
title: "Interface: ModuleIRunContextEditor"
sidebar_label: "engine/src.ModuleIRunContextEditor"
custom_edit_url: null
---

[engine/src](../modules/engine_src.md).ModuleIRunContextEditor

## Hierarchy

- [`IRunContextEditor`](engine_src.IRunContextEditor.md)

  ↳ **`ModuleIRunContextEditor`**

## Properties

### abort

• **abort**: () => `void`

#### Type declaration

▸ (): `void`

##### Returns

`void`

#### Inherited from

[IRunContextEditor](engine_src.IRunContextEditor.md).[abort](engine_src.IRunContextEditor.md#abort)

#### Defined in

[packages/engine/src/lib/types.ts:302](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/types.ts#L302)

___

### components

• **components**: `Map`<`string`, `Component`\>

#### Inherited from

[IRunContextEditor](engine_src.IRunContextEditor.md).[components](engine_src.IRunContextEditor.md#components)

#### Defined in

node_modules/rete/types/core/context.d.ts:8

___

### events

• **events**: `Object`

#### Index signature

▪ [key: `string`]: `Function`[]

#### Inherited from

[IRunContextEditor](engine_src.IRunContextEditor.md).[events](engine_src.IRunContextEditor.md#events)

#### Defined in

node_modules/rete/types/core/emitter.d.ts:3

___

### id

• **id**: `string`

#### Inherited from

[IRunContextEditor](engine_src.IRunContextEditor.md).[id](engine_src.IRunContextEditor.md#id)

#### Defined in

node_modules/rete/types/core/context.d.ts:6

___

### magick

• **magick**: [`EditorContext`](engine_src.EditorContext.md)

#### Inherited from

[IRunContextEditor](engine_src.IRunContextEditor.md).[magick](engine_src.IRunContextEditor.md#magick)

#### Defined in

[packages/engine/src/lib/types.ts:301](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/types.ts#L301)

___

### moduleManager

• **moduleManager**: [`ModuleManager`](../classes/engine_src.ModuleManager.md)

#### Defined in

[packages/engine/src/lib/plugins/modulePlugin/index.ts:24](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/plugins/modulePlugin/index.ts#L24)

___

### nodes

• **nodes**: `Node`[]

#### Inherited from

[IRunContextEditor](engine_src.IRunContextEditor.md).[nodes](engine_src.IRunContextEditor.md#nodes)

#### Defined in

node_modules/rete/types/editor.d.ts:12

___

### plugins

• **plugins**: `Map`<`string`, `unknown`\>

#### Inherited from

[IRunContextEditor](engine_src.IRunContextEditor.md).[plugins](engine_src.IRunContextEditor.md#plugins)

#### Defined in

node_modules/rete/types/core/context.d.ts:7

___

### selected

• **selected**: `Selected`

#### Inherited from

[IRunContextEditor](engine_src.IRunContextEditor.md).[selected](engine_src.IRunContextEditor.md#selected)

#### Defined in

node_modules/rete/types/editor.d.ts:13

___

### silent

• **silent**: `boolean`

#### Inherited from

[IRunContextEditor](engine_src.IRunContextEditor.md).[silent](engine_src.IRunContextEditor.md#silent)

#### Defined in

node_modules/rete/types/core/emitter.d.ts:6

___

### view

• **view**: `EditorView`

#### Inherited from

[IRunContextEditor](engine_src.IRunContextEditor.md).[view](engine_src.IRunContextEditor.md#view)

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

[IRunContextEditor](engine_src.IRunContextEditor.md).[addNode](engine_src.IRunContextEditor.md#addnode)

#### Defined in

node_modules/rete/types/editor.d.ts:16

___

### afterImport

▸ **afterImport**(): `boolean`

#### Returns

`boolean`

#### Inherited from

[IRunContextEditor](engine_src.IRunContextEditor.md).[afterImport](engine_src.IRunContextEditor.md#afterimport)

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

[IRunContextEditor](engine_src.IRunContextEditor.md).[beforeImport](engine_src.IRunContextEditor.md#beforeimport)

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

[IRunContextEditor](engine_src.IRunContextEditor.md).[bind](engine_src.IRunContextEditor.md#bind)

#### Defined in

node_modules/rete/types/core/emitter.d.ts:10

___

### clear

▸ **clear**(): `void`

#### Returns

`void`

#### Inherited from

[IRunContextEditor](engine_src.IRunContextEditor.md).[clear](engine_src.IRunContextEditor.md#clear)

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

[IRunContextEditor](engine_src.IRunContextEditor.md).[connect](engine_src.IRunContextEditor.md#connect)

#### Defined in

node_modules/rete/types/editor.d.ts:18

___

### destroy

▸ **destroy**(): `void`

#### Returns

`void`

#### Inherited from

[IRunContextEditor](engine_src.IRunContextEditor.md).[destroy](engine_src.IRunContextEditor.md#destroy)

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

[IRunContextEditor](engine_src.IRunContextEditor.md).[exist](engine_src.IRunContextEditor.md#exist)

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

[IRunContextEditor](engine_src.IRunContextEditor.md).[fromJSON](engine_src.IRunContextEditor.md#fromjson)

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

[IRunContextEditor](engine_src.IRunContextEditor.md).[getComponent](engine_src.IRunContextEditor.md#getcomponent)

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

[IRunContextEditor](engine_src.IRunContextEditor.md).[on](engine_src.IRunContextEditor.md#on)

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

[IRunContextEditor](engine_src.IRunContextEditor.md).[register](engine_src.IRunContextEditor.md#register)

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

[IRunContextEditor](engine_src.IRunContextEditor.md).[removeConnection](engine_src.IRunContextEditor.md#removeconnection)

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

[IRunContextEditor](engine_src.IRunContextEditor.md).[removeNode](engine_src.IRunContextEditor.md#removenode)

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

[IRunContextEditor](engine_src.IRunContextEditor.md).[selectNode](engine_src.IRunContextEditor.md#selectnode)

#### Defined in

node_modules/rete/types/editor.d.ts:20

___

### toJSON

▸ **toJSON**(): `Data`

#### Returns

`Data`

#### Inherited from

[IRunContextEditor](engine_src.IRunContextEditor.md).[toJSON](engine_src.IRunContextEditor.md#tojson)

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

[IRunContextEditor](engine_src.IRunContextEditor.md).[trigger](engine_src.IRunContextEditor.md#trigger)

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

[IRunContextEditor](engine_src.IRunContextEditor.md).[use](engine_src.IRunContextEditor.md#use)

#### Defined in

node_modules/rete/types/core/context.d.ts:10
