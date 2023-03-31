---
id: "TextInputControl"
title: "Class: TextInputControl"
sidebar_label: "TextInputControl"
sidebar_position: 0
custom_edit_url: null
---

A custom Rete control for a text input. It extends the Control class
from Rete and provides a renderer for a React component.

## Hierarchy

- `Control`

  ↳ **`TextInputControl`**

## Constructors

### constructor

• **new TextInputControl**(`param0`)

Constructor for the custom TextInputControl control.

**`Property`**

The associated Rete editor

**`Property`**

The input key to identify this control

**`Property`**

The initial input value

**`Property`**

The label to display with the text input (optional)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `param0` | `Object` | An object containing editor, key, value, and label properties |
| `param0.editor` | ``null`` \| [`MagickEditor`](MagickEditor.md) | - |
| `param0.key` | `string` | - |
| `param0.label?` | `string` | - |
| `param0.value` | `string` | - |

#### Overrides

Control.constructor

#### Defined in

[packages/engine/src/lib/dataControls/TextInputControl.tsx:68](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/dataControls/TextInputControl.tsx#L68)

## Properties

### component

• **component**: `FC`<`ReactTextInputProps`\>

#### Defined in

[packages/engine/src/lib/dataControls/TextInputControl.tsx:57](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/dataControls/TextInputControl.tsx#L57)

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

[packages/engine/src/lib/dataControls/TextInputControl.tsx:58](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/dataControls/TextInputControl.tsx#L58)

___

### render

• **render**: `string`

#### Defined in

[packages/engine/src/lib/dataControls/TextInputControl.tsx:56](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/dataControls/TextInputControl.tsx#L56)

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
