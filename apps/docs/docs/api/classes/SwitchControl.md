---
id: "SwitchControl"
title: "Class: SwitchControl"
sidebar_label: "SwitchControl"
sidebar_position: 0
custom_edit_url: null
---

A general class for the data controls.

## Hierarchy

- [`DataControl`](DataControl.md)

  ↳ **`SwitchControl`**

## Constructors

### constructor

• **new SwitchControl**(`{`)

Creates an instance of SwitchControl.

**`Memberof`**

SwitchControl

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `{` | `Object` | dataKey, name, icon = 'hand', label = 'Toggle', defaultValue = {}, } |
| `{.dataKey` | `string` | - |
| `{.defaultValue?` | `unknown` | - |
| `{.icon?` | `string` | - |
| `{.label` | `string` | - |
| `{.name` | `string` | - |

#### Overrides

[DataControl](DataControl.md).[constructor](DataControl.md#constructor)

#### Defined in

[packages/core/shared/src/dataControls/SwitchControl.ts:29](https://github.com/Oneirocom/Magick/blob/c560ff45/packages/core/shared/src/dataControls/SwitchControl.ts#L29)

## Properties

### component

• **component**: ``null`` \| [`MagickComponent`](MagickComponent.md)<`unknown`\> = `null`

#### Inherited from

[DataControl](DataControl.md).[component](DataControl.md#component)

#### Defined in

[packages/core/shared/src/plugins/inspectorPlugin/DataControl.ts:16](https://github.com/Oneirocom/Magick/blob/c560ff45/packages/core/shared/src/plugins/inspectorPlugin/DataControl.ts#L16)

___

### componentData

• **componentData**: [`ComponentData`](../#componentdata)<[`TaskType`](../#tasktype)\>

#### Inherited from

[DataControl](DataControl.md).[componentData](DataControl.md#componentdata)

#### Defined in

[packages/core/shared/src/plugins/inspectorPlugin/DataControl.ts:21](https://github.com/Oneirocom/Magick/blob/c560ff45/packages/core/shared/src/plugins/inspectorPlugin/DataControl.ts#L21)

___

### componentKey

• **componentKey**: `string`

#### Inherited from

[DataControl](DataControl.md).[componentKey](DataControl.md#componentkey)

#### Defined in

[packages/core/shared/src/plugins/inspectorPlugin/DataControl.ts:22](https://github.com/Oneirocom/Magick/blob/c560ff45/packages/core/shared/src/plugins/inspectorPlugin/DataControl.ts#L22)

___

### data

• **data**: [`ComponentData`](../#componentdata)<[`TaskType`](../#tasktype)\>

#### Inherited from

[DataControl](DataControl.md).[data](DataControl.md#data)

#### Defined in

[packages/core/shared/src/plugins/inspectorPlugin/DataControl.ts:28](https://github.com/Oneirocom/Magick/blob/c560ff45/packages/core/shared/src/plugins/inspectorPlugin/DataControl.ts#L28)

___

### dataKey

• **dataKey**: `string`

#### Inherited from

[DataControl](DataControl.md).[dataKey](DataControl.md#datakey)

#### Defined in

[packages/core/shared/src/plugins/inspectorPlugin/DataControl.ts:18](https://github.com/Oneirocom/Magick/blob/c560ff45/packages/core/shared/src/plugins/inspectorPlugin/DataControl.ts#L18)

___

### defaultValue

• **defaultValue**: `unknown`

#### Inherited from

[DataControl](DataControl.md).[defaultValue](DataControl.md#defaultvalue)

#### Defined in

[packages/core/shared/src/plugins/inspectorPlugin/DataControl.ts:20](https://github.com/Oneirocom/Magick/blob/c560ff45/packages/core/shared/src/plugins/inspectorPlugin/DataControl.ts#L20)

___

### editor

• **editor**: ``null`` \| `NodeEditor`<`any`\> = `null`

#### Inherited from

[DataControl](DataControl.md).[editor](DataControl.md#editor)

#### Defined in

[packages/core/shared/src/plugins/inspectorPlugin/DataControl.ts:14](https://github.com/Oneirocom/Magick/blob/c560ff45/packages/core/shared/src/plugins/inspectorPlugin/DataControl.ts#L14)

___

### expanded

• `Optional` **expanded**: `boolean`

#### Inherited from

[DataControl](DataControl.md).[expanded](DataControl.md#expanded)

#### Defined in

[packages/core/shared/src/plugins/inspectorPlugin/DataControl.ts:29](https://github.com/Oneirocom/Magick/blob/c560ff45/packages/core/shared/src/plugins/inspectorPlugin/DataControl.ts#L29)

___

### icon

• **icon**: `string`

#### Inherited from

[DataControl](DataControl.md).[icon](DataControl.md#icon)

#### Defined in

[packages/core/shared/src/plugins/inspectorPlugin/DataControl.ts:24](https://github.com/Oneirocom/Magick/blob/c560ff45/packages/core/shared/src/plugins/inspectorPlugin/DataControl.ts#L24)

___

### id

• **id**: ``null`` \| `string` = `null`

#### Inherited from

[DataControl](DataControl.md).[id](DataControl.md#id)

#### Defined in

[packages/core/shared/src/plugins/inspectorPlugin/DataControl.ts:17](https://github.com/Oneirocom/Magick/blob/c560ff45/packages/core/shared/src/plugins/inspectorPlugin/DataControl.ts#L17)

___

### inspector

• **inspector**: ``null`` \| `Inspector` = `null`

#### Inherited from

[DataControl](DataControl.md).[inspector](DataControl.md#inspector)

#### Defined in

[packages/core/shared/src/plugins/inspectorPlugin/DataControl.ts:13](https://github.com/Oneirocom/Magick/blob/c560ff45/packages/core/shared/src/plugins/inspectorPlugin/DataControl.ts#L13)

___

### name

• **name**: `string`

#### Inherited from

[DataControl](DataControl.md).[name](DataControl.md#name)

#### Defined in

[packages/core/shared/src/plugins/inspectorPlugin/DataControl.ts:19](https://github.com/Oneirocom/Magick/blob/c560ff45/packages/core/shared/src/plugins/inspectorPlugin/DataControl.ts#L19)

___

### node

• **node**: ``null`` \| [`MagickNode`](../#magicknode) = `null`

#### Inherited from

[DataControl](DataControl.md).[node](DataControl.md#node)

#### Defined in

[packages/core/shared/src/plugins/inspectorPlugin/DataControl.ts:15](https://github.com/Oneirocom/Magick/blob/c560ff45/packages/core/shared/src/plugins/inspectorPlugin/DataControl.ts#L15)

___

### options

• **options**: `Record`<`string`, `unknown`\>

#### Inherited from

[DataControl](DataControl.md).[options](DataControl.md#options)

#### Defined in

[packages/core/shared/src/plugins/inspectorPlugin/DataControl.ts:23](https://github.com/Oneirocom/Magick/blob/c560ff45/packages/core/shared/src/plugins/inspectorPlugin/DataControl.ts#L23)

___

### placeholder

• **placeholder**: `string`

#### Inherited from

[DataControl](DataControl.md).[placeholder](DataControl.md#placeholder)

#### Defined in

[packages/core/shared/src/plugins/inspectorPlugin/DataControl.ts:27](https://github.com/Oneirocom/Magick/blob/c560ff45/packages/core/shared/src/plugins/inspectorPlugin/DataControl.ts#L27)

___

### type

• **type**: `string`

#### Inherited from

[DataControl](DataControl.md).[type](DataControl.md#type)

#### Defined in

[packages/core/shared/src/plugins/inspectorPlugin/DataControl.ts:26](https://github.com/Oneirocom/Magick/blob/c560ff45/packages/core/shared/src/plugins/inspectorPlugin/DataControl.ts#L26)

___

### write

• **write**: `boolean`

#### Inherited from

[DataControl](DataControl.md).[write](DataControl.md#write)

#### Defined in

[packages/core/shared/src/plugins/inspectorPlugin/DataControl.ts:25](https://github.com/Oneirocom/Magick/blob/c560ff45/packages/core/shared/src/plugins/inspectorPlugin/DataControl.ts#L25)

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

#### Inherited from

DataControl.control

#### Defined in

[packages/core/shared/src/plugins/inspectorPlugin/DataControl.ts:89](https://github.com/Oneirocom/Magick/blob/c560ff45/packages/core/shared/src/plugins/inspectorPlugin/DataControl.ts#L89)

## Methods

### onAdd

▸ **onAdd**(): `undefined` \| `void`

Abstract method to execute when a control is added.

#### Returns

`undefined` \| `void`

#### Inherited from

[DataControl](DataControl.md).[onAdd](DataControl.md#onadd)

#### Defined in

[packages/core/shared/src/plugins/inspectorPlugin/DataControl.ts:107](https://github.com/Oneirocom/Magick/blob/c560ff45/packages/core/shared/src/plugins/inspectorPlugin/DataControl.ts#L107)

___

### onData

▸ **onData**(): `void`

The event handler for data.

**`Memberof`**

SwitchControl

#### Returns

`void`

#### Overrides

[DataControl](DataControl.md).[onData](DataControl.md#ondata)

#### Defined in

[packages/core/shared/src/dataControls/SwitchControl.ts:58](https://github.com/Oneirocom/Magick/blob/c560ff45/packages/core/shared/src/dataControls/SwitchControl.ts#L58)

___

### onRemove

▸ **onRemove**(): `undefined` \| `void`

Abstract method to execute when a control is removed.

#### Returns

`undefined` \| `void`

#### Inherited from

[DataControl](DataControl.md).[onRemove](DataControl.md#onremove)

#### Defined in

[packages/core/shared/src/plugins/inspectorPlugin/DataControl.ts:115](https://github.com/Oneirocom/Magick/blob/c560ff45/packages/core/shared/src/plugins/inspectorPlugin/DataControl.ts#L115)
