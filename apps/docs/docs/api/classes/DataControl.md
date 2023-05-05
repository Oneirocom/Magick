---
id: "DataControl"
title: "Class: DataControl"
sidebar_label: "DataControl"
sidebar_position: 0
custom_edit_url: null
---

A general class for the data controls.

## Hierarchy

- **`DataControl`**

  ↳ [`BooleanControl`](BooleanControl.md)

  ↳ [`CodeControl`](CodeControl.md)

  ↳ [`DropdownControl`](DropdownControl.md)

  ↳ [`NumberControl`](NumberControl.md)

  ↳ [`PlaytestControl`](PlaytestControl.md)

  ↳ [`SocketGeneratorControl`](SocketGeneratorControl.md)

  ↳ [`SwitchControl`](SwitchControl.md)

  ↳ [`InputControl`](InputControl.md)

## Constructors

### constructor

• **new DataControl**(`«destructured»`)

Create a new instance of the DataControl class.

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Object` |
| › `component` | `string` |
| › `data?` | [`ComponentData`](../#componentdata)<[`TaskType`](../#tasktype)\> |
| › `dataKey` | `string` |
| › `defaultValue?` | `unknown` |
| › `icon?` | `string` |
| › `name` | `string` |
| › `options?` | `Record`<`string`, `unknown`\> |
| › `placeholder?` | `string` |
| › `type?` | `string` |
| › `write?` | `boolean` |

#### Defined in

[packages/core/shared/src/plugins/inspectorPlugin/DataControl.ts:45](https://github.com/Oneirocom/Magick/blob/0b84928f/packages/core/shared/src/plugins/inspectorPlugin/DataControl.ts#L45)

## Properties

### component

• **component**: ``null`` \| [`MagickComponent`](MagickComponent.md)<`unknown`\> = `null`

#### Defined in

[packages/core/shared/src/plugins/inspectorPlugin/DataControl.ts:16](https://github.com/Oneirocom/Magick/blob/0b84928f/packages/core/shared/src/plugins/inspectorPlugin/DataControl.ts#L16)

___

### componentData

• **componentData**: [`ComponentData`](../#componentdata)<[`TaskType`](../#tasktype)\>

#### Defined in

[packages/core/shared/src/plugins/inspectorPlugin/DataControl.ts:21](https://github.com/Oneirocom/Magick/blob/0b84928f/packages/core/shared/src/plugins/inspectorPlugin/DataControl.ts#L21)

___

### componentKey

• **componentKey**: `string`

#### Defined in

[packages/core/shared/src/plugins/inspectorPlugin/DataControl.ts:22](https://github.com/Oneirocom/Magick/blob/0b84928f/packages/core/shared/src/plugins/inspectorPlugin/DataControl.ts#L22)

___

### data

• **data**: [`ComponentData`](../#componentdata)<[`TaskType`](../#tasktype)\>

#### Defined in

[packages/core/shared/src/plugins/inspectorPlugin/DataControl.ts:28](https://github.com/Oneirocom/Magick/blob/0b84928f/packages/core/shared/src/plugins/inspectorPlugin/DataControl.ts#L28)

___

### dataKey

• **dataKey**: `string`

#### Defined in

[packages/core/shared/src/plugins/inspectorPlugin/DataControl.ts:18](https://github.com/Oneirocom/Magick/blob/0b84928f/packages/core/shared/src/plugins/inspectorPlugin/DataControl.ts#L18)

___

### defaultValue

• **defaultValue**: `unknown`

#### Defined in

[packages/core/shared/src/plugins/inspectorPlugin/DataControl.ts:20](https://github.com/Oneirocom/Magick/blob/0b84928f/packages/core/shared/src/plugins/inspectorPlugin/DataControl.ts#L20)

___

### editor

• **editor**: ``null`` \| `NodeEditor`<`any`\> = `null`

#### Defined in

[packages/core/shared/src/plugins/inspectorPlugin/DataControl.ts:14](https://github.com/Oneirocom/Magick/blob/0b84928f/packages/core/shared/src/plugins/inspectorPlugin/DataControl.ts#L14)

___

### expanded

• `Optional` **expanded**: `boolean`

#### Defined in

[packages/core/shared/src/plugins/inspectorPlugin/DataControl.ts:29](https://github.com/Oneirocom/Magick/blob/0b84928f/packages/core/shared/src/plugins/inspectorPlugin/DataControl.ts#L29)

___

### icon

• **icon**: `string`

#### Defined in

[packages/core/shared/src/plugins/inspectorPlugin/DataControl.ts:24](https://github.com/Oneirocom/Magick/blob/0b84928f/packages/core/shared/src/plugins/inspectorPlugin/DataControl.ts#L24)

___

### id

• **id**: ``null`` \| `string` = `null`

#### Defined in

[packages/core/shared/src/plugins/inspectorPlugin/DataControl.ts:17](https://github.com/Oneirocom/Magick/blob/0b84928f/packages/core/shared/src/plugins/inspectorPlugin/DataControl.ts#L17)

___

### inspector

• **inspector**: ``null`` \| `Inspector` = `null`

#### Defined in

[packages/core/shared/src/plugins/inspectorPlugin/DataControl.ts:13](https://github.com/Oneirocom/Magick/blob/0b84928f/packages/core/shared/src/plugins/inspectorPlugin/DataControl.ts#L13)

___

### name

• **name**: `string`

#### Defined in

[packages/core/shared/src/plugins/inspectorPlugin/DataControl.ts:19](https://github.com/Oneirocom/Magick/blob/0b84928f/packages/core/shared/src/plugins/inspectorPlugin/DataControl.ts#L19)

___

### node

• **node**: ``null`` \| [`MagickNode`](../#magicknode) = `null`

#### Defined in

[packages/core/shared/src/plugins/inspectorPlugin/DataControl.ts:15](https://github.com/Oneirocom/Magick/blob/0b84928f/packages/core/shared/src/plugins/inspectorPlugin/DataControl.ts#L15)

___

### options

• **options**: `Record`<`string`, `unknown`\>

#### Defined in

[packages/core/shared/src/plugins/inspectorPlugin/DataControl.ts:23](https://github.com/Oneirocom/Magick/blob/0b84928f/packages/core/shared/src/plugins/inspectorPlugin/DataControl.ts#L23)

___

### placeholder

• **placeholder**: `string`

#### Defined in

[packages/core/shared/src/plugins/inspectorPlugin/DataControl.ts:27](https://github.com/Oneirocom/Magick/blob/0b84928f/packages/core/shared/src/plugins/inspectorPlugin/DataControl.ts#L27)

___

### type

• **type**: `string`

#### Defined in

[packages/core/shared/src/plugins/inspectorPlugin/DataControl.ts:26](https://github.com/Oneirocom/Magick/blob/0b84928f/packages/core/shared/src/plugins/inspectorPlugin/DataControl.ts#L26)

___

### write

• **write**: `boolean`

#### Defined in

[packages/core/shared/src/plugins/inspectorPlugin/DataControl.ts:25](https://github.com/Oneirocom/Magick/blob/0b84928f/packages/core/shared/src/plugins/inspectorPlugin/DataControl.ts#L25)

## Accessors

### control

• `get` **control**(): `Object`

Serializer to easily extract the data control's information for publishing.

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `component` | `string` |
| `data` | [`ComponentData`](../#componentdata)<[`TaskType`](../#tasktype)\> |
| `dataKey` | `string` |
| `icon` | `string` |
| `id` | ``null`` \| `string` |
| `name` | `string` |
| `options` | `Record`<`string`, `unknown`\> |
| `placeholder` | `string` |
| `type` | `string` |

#### Defined in

[packages/core/shared/src/plugins/inspectorPlugin/DataControl.ts:89](https://github.com/Oneirocom/Magick/blob/0b84928f/packages/core/shared/src/plugins/inspectorPlugin/DataControl.ts#L89)

## Methods

### onAdd

▸ **onAdd**(): `undefined` \| `void`

Abstract method to execute when a control is added.

#### Returns

`undefined` \| `void`

#### Defined in

[packages/core/shared/src/plugins/inspectorPlugin/DataControl.ts:107](https://github.com/Oneirocom/Magick/blob/0b84928f/packages/core/shared/src/plugins/inspectorPlugin/DataControl.ts#L107)

___

### onData

▸ `Optional` **onData**(`...args`): `void` \| `Promise`<`void`\>

Abstract method to handle updating data (optional).

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `...args` | `unknown`[] | An array of unknown arguments |

#### Returns

`void` \| `Promise`<`void`\>

#### Defined in

[packages/core/shared/src/plugins/inspectorPlugin/DataControl.ts:124](https://github.com/Oneirocom/Magick/blob/0b84928f/packages/core/shared/src/plugins/inspectorPlugin/DataControl.ts#L124)

___

### onRemove

▸ **onRemove**(): `undefined` \| `void`

Abstract method to execute when a control is removed.

#### Returns

`undefined` \| `void`

#### Defined in

[packages/core/shared/src/plugins/inspectorPlugin/DataControl.ts:115](https://github.com/Oneirocom/Magick/blob/0b84928f/packages/core/shared/src/plugins/inspectorPlugin/DataControl.ts#L115)
