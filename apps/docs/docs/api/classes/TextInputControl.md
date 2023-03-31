---
id: "TextInputControl"
title: "Class: TextInputControl"
sidebar_label: "TextInputControl"
sidebar_position: 0
custom_edit_url: null
---

## Hierarchy

- `Control`

  ↳ **`TextInputControl`**

## Constructors

### constructor

• **new TextInputControl**(`«destructured»`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Object` |
| › `editor` | ``null`` \| [`MagickEditor`](MagickEditor.md) |
| › `key` | `string` |
| › `label?` | `string` |
| › `value` | `string` |

#### Overrides

Control.constructor

#### Defined in

[packages/engine/src/lib/dataControls/TextInputControl.tsx:44](https://github.com/Oneirocom/MagickML/blob/dcf6d21c/packages/engine/src/lib/dataControls/TextInputControl.tsx#L44)

## Properties

### component

• **component**: `FC`<`ReactTextInputProps`\>

#### Defined in

[packages/engine/src/lib/dataControls/TextInputControl.tsx:42](https://github.com/Oneirocom/MagickML/blob/dcf6d21c/packages/engine/src/lib/dataControls/TextInputControl.tsx#L42)

___

### data

• **data**: `unknown`

#### Inherited from

Control.data

#### Defined in

node_modules/rete/types/control.d.ts:5

___

### key

• **key**: `string`

#### Inherited from

Control.key

#### Defined in

node_modules/rete/types/control.d.ts:4

___

### parent

• **parent**: ``null`` \| `Node` \| `Input`

#### Inherited from

Control.parent

#### Defined in

node_modules/rete/types/control.d.ts:6

___

### props

• **props**: `ReactTextInputProps`

#### Defined in

[packages/engine/src/lib/dataControls/TextInputControl.tsx:43](https://github.com/Oneirocom/MagickML/blob/dcf6d21c/packages/engine/src/lib/dataControls/TextInputControl.tsx#L43)

___

### render

• **render**: `string`

#### Defined in

[packages/engine/src/lib/dataControls/TextInputControl.tsx:41](https://github.com/Oneirocom/MagickML/blob/dcf6d21c/packages/engine/src/lib/dataControls/TextInputControl.tsx#L41)

## Methods

### getData

▸ **getData**(`key`): `unknown`

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |

#### Returns

`unknown`

#### Inherited from

Control.getData

#### Defined in

node_modules/rete/types/control.d.ts:9

___

### getNode

▸ **getNode**(): `Node`

#### Returns

`Node`

#### Inherited from

Control.getNode

#### Defined in

node_modules/rete/types/control.d.ts:8

___

### putData

▸ **putData**(`key`, `data`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |
| `data` | `unknown` |

#### Returns

`void`

#### Inherited from

Control.putData

#### Defined in

node_modules/rete/types/control.d.ts:10
