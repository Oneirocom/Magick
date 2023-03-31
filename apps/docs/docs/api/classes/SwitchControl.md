---
id: "SwitchControl"
title: "Class: SwitchControl"
sidebar_label: "SwitchControl"
sidebar_position: 0
custom_edit_url: null
---

## Hierarchy

- `DataControl`

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

DataControl.constructor

#### Defined in

[packages/engine/src/lib/dataControls/SwitchControl.ts:29](https://github.com/Oneirocom/MagickML/blob/1bc5ce20/packages/engine/src/lib/dataControls/SwitchControl.ts#L29)

## Properties

### component

• **component**: ``null`` \| [`MagickComponent`](MagickComponent.md)<`unknown`\> = `null`

#### Inherited from

DataControl.component

#### Defined in

[packages/engine/src/lib/plugins/inspectorPlugin/DataControl.ts:11](https://github.com/Oneirocom/MagickML/blob/1bc5ce20/packages/engine/src/lib/plugins/inspectorPlugin/DataControl.ts#L11)

___

### componentData

• **componentData**: [`ComponentData`](../#componentdata)<[`TaskType`](../#tasktype)\>

#### Inherited from

DataControl.componentData

#### Defined in

[packages/engine/src/lib/plugins/inspectorPlugin/DataControl.ts:16](https://github.com/Oneirocom/MagickML/blob/1bc5ce20/packages/engine/src/lib/plugins/inspectorPlugin/DataControl.ts#L16)

___

### componentKey

• **componentKey**: `string`

#### Inherited from

DataControl.componentKey

#### Defined in

[packages/engine/src/lib/plugins/inspectorPlugin/DataControl.ts:17](https://github.com/Oneirocom/MagickML/blob/1bc5ce20/packages/engine/src/lib/plugins/inspectorPlugin/DataControl.ts#L17)

___

### data

• **data**: [`ComponentData`](../#componentdata)<[`TaskType`](../#tasktype)\>

#### Inherited from

DataControl.data

#### Defined in

[packages/engine/src/lib/plugins/inspectorPlugin/DataControl.ts:23](https://github.com/Oneirocom/MagickML/blob/1bc5ce20/packages/engine/src/lib/plugins/inspectorPlugin/DataControl.ts#L23)

___

### dataKey

• **dataKey**: `string`

#### Inherited from

DataControl.dataKey

#### Defined in

[packages/engine/src/lib/plugins/inspectorPlugin/DataControl.ts:13](https://github.com/Oneirocom/MagickML/blob/1bc5ce20/packages/engine/src/lib/plugins/inspectorPlugin/DataControl.ts#L13)

___

### defaultValue

• **defaultValue**: `unknown`

#### Inherited from

DataControl.defaultValue

#### Defined in

[packages/engine/src/lib/plugins/inspectorPlugin/DataControl.ts:15](https://github.com/Oneirocom/MagickML/blob/1bc5ce20/packages/engine/src/lib/plugins/inspectorPlugin/DataControl.ts#L15)

___

### editor

• **editor**: ``null`` \| `NodeEditor`<`any`\> = `null`

#### Inherited from

DataControl.editor

#### Defined in

[packages/engine/src/lib/plugins/inspectorPlugin/DataControl.ts:9](https://github.com/Oneirocom/MagickML/blob/1bc5ce20/packages/engine/src/lib/plugins/inspectorPlugin/DataControl.ts#L9)

___

### expanded

• `Optional` **expanded**: `boolean`

#### Inherited from

DataControl.expanded

#### Defined in

[packages/engine/src/lib/plugins/inspectorPlugin/DataControl.ts:24](https://github.com/Oneirocom/MagickML/blob/1bc5ce20/packages/engine/src/lib/plugins/inspectorPlugin/DataControl.ts#L24)

___

### icon

• **icon**: `string`

#### Inherited from

DataControl.icon

#### Defined in

[packages/engine/src/lib/plugins/inspectorPlugin/DataControl.ts:19](https://github.com/Oneirocom/MagickML/blob/1bc5ce20/packages/engine/src/lib/plugins/inspectorPlugin/DataControl.ts#L19)

___

### id

• **id**: ``null`` \| `string` = `null`

#### Inherited from

DataControl.id

#### Defined in

[packages/engine/src/lib/plugins/inspectorPlugin/DataControl.ts:12](https://github.com/Oneirocom/MagickML/blob/1bc5ce20/packages/engine/src/lib/plugins/inspectorPlugin/DataControl.ts#L12)

___

### inspector

• **inspector**: ``null`` \| `Inspector` = `null`

#### Inherited from

DataControl.inspector

#### Defined in

[packages/engine/src/lib/plugins/inspectorPlugin/DataControl.ts:8](https://github.com/Oneirocom/MagickML/blob/1bc5ce20/packages/engine/src/lib/plugins/inspectorPlugin/DataControl.ts#L8)

___

### name

• **name**: `string`

#### Inherited from

DataControl.name

#### Defined in

[packages/engine/src/lib/plugins/inspectorPlugin/DataControl.ts:14](https://github.com/Oneirocom/MagickML/blob/1bc5ce20/packages/engine/src/lib/plugins/inspectorPlugin/DataControl.ts#L14)

___

### node

• **node**: ``null`` \| [`MagickNode`](../#magicknode) = `null`

#### Inherited from

DataControl.node

#### Defined in

[packages/engine/src/lib/plugins/inspectorPlugin/DataControl.ts:10](https://github.com/Oneirocom/MagickML/blob/1bc5ce20/packages/engine/src/lib/plugins/inspectorPlugin/DataControl.ts#L10)

___

### options

• **options**: `object`

#### Inherited from

DataControl.options

#### Defined in

[packages/engine/src/lib/plugins/inspectorPlugin/DataControl.ts:18](https://github.com/Oneirocom/MagickML/blob/1bc5ce20/packages/engine/src/lib/plugins/inspectorPlugin/DataControl.ts#L18)

___

### placeholder

• **placeholder**: `string`

#### Inherited from

DataControl.placeholder

#### Defined in

[packages/engine/src/lib/plugins/inspectorPlugin/DataControl.ts:22](https://github.com/Oneirocom/MagickML/blob/1bc5ce20/packages/engine/src/lib/plugins/inspectorPlugin/DataControl.ts#L22)

___

### type

• **type**: `string`

#### Inherited from

DataControl.type

#### Defined in

[packages/engine/src/lib/plugins/inspectorPlugin/DataControl.ts:21](https://github.com/Oneirocom/MagickML/blob/1bc5ce20/packages/engine/src/lib/plugins/inspectorPlugin/DataControl.ts#L21)

___

### write

• **write**: `boolean`

#### Inherited from

DataControl.write

#### Defined in

[packages/engine/src/lib/plugins/inspectorPlugin/DataControl.ts:20](https://github.com/Oneirocom/MagickML/blob/1bc5ce20/packages/engine/src/lib/plugins/inspectorPlugin/DataControl.ts#L20)

## Accessors

### control

• `get` **control**(): `Object`

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
| `options` | `object` |
| `placeholder` | `string` |
| `type` | `string` |

#### Inherited from

DataControl.control

#### Defined in

[packages/engine/src/lib/plugins/inspectorPlugin/DataControl.ts:67](https://github.com/Oneirocom/MagickML/blob/1bc5ce20/packages/engine/src/lib/plugins/inspectorPlugin/DataControl.ts#L67)

## Methods

### onAdd

▸ **onAdd**(): `void`

#### Returns

`void`

#### Inherited from

DataControl.onAdd

#### Defined in

[packages/engine/src/lib/plugins/inspectorPlugin/DataControl.ts:81](https://github.com/Oneirocom/MagickML/blob/1bc5ce20/packages/engine/src/lib/plugins/inspectorPlugin/DataControl.ts#L81)

___

### onData

▸ **onData**(): `void`

The event handler for data.

**`Memberof`**

SwitchControl

#### Returns

`void`

#### Overrides

DataControl.onData

#### Defined in

[packages/engine/src/lib/dataControls/SwitchControl.ts:58](https://github.com/Oneirocom/MagickML/blob/1bc5ce20/packages/engine/src/lib/dataControls/SwitchControl.ts#L58)

___

### onRemove

▸ **onRemove**(): `void`

#### Returns

`void`

#### Inherited from

DataControl.onRemove

#### Defined in

[packages/engine/src/lib/plugins/inspectorPlugin/DataControl.ts:85](https://github.com/Oneirocom/MagickML/blob/1bc5ce20/packages/engine/src/lib/plugins/inspectorPlugin/DataControl.ts#L85)
