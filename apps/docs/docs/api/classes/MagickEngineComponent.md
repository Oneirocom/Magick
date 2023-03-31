---
id: "MagickEngineComponent"
title: "Class: MagickEngineComponent<WorkerReturnType>"
sidebar_label: "MagickEngineComponent"
sidebar_position: 0
custom_edit_url: null
---

## Type parameters

| Name |
| :------ |
| `WorkerReturnType` |

## Hierarchy

- **`MagickEngineComponent`**

  ↳ [`MagickComponent`](MagickComponent.md)

## Constructors

### constructor

• **new MagickEngineComponent**<`WorkerReturnType`\>(`name`)

#### Type parameters

| Name |
| :------ |
| `WorkerReturnType` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |

#### Defined in

[packages/engine/src/lib/engine.ts:41](https://github.com/Oneirocom/MagickML/blob/f4db6e49/packages/engine/src/lib/engine.ts#L41)

## Properties

### data

• **data**: `unknown` = `{}`

#### Defined in

[packages/engine/src/lib/engine.ts:38](https://github.com/Oneirocom/MagickML/blob/f4db6e49/packages/engine/src/lib/engine.ts#L38)

___

### engine

• **engine**: ``null`` \| `Engine` = `null`

#### Defined in

[packages/engine/src/lib/engine.ts:39](https://github.com/Oneirocom/MagickML/blob/f4db6e49/packages/engine/src/lib/engine.ts#L39)

___

### name

• **name**: `string`

#### Defined in

[packages/engine/src/lib/engine.ts:37](https://github.com/Oneirocom/MagickML/blob/f4db6e49/packages/engine/src/lib/engine.ts#L37)

## Methods

### worker

▸ `Abstract` **worker**(`node`, `inputs`, `outputs`, `context`, `...args`): `WorkerReturnType`

#### Parameters

| Name | Type |
| :------ | :------ |
| `node` | [`WorkerData`](../#workerdata) |
| `inputs` | [`MagickWorkerInputs`](../#magickworkerinputs) |
| `outputs` | `WorkerOutputs` |
| `context` | `unknown` |
| `...args` | `unknown`[] |

#### Returns

`WorkerReturnType`

#### Defined in

[packages/engine/src/lib/engine.ts:45](https://github.com/Oneirocom/MagickML/blob/f4db6e49/packages/engine/src/lib/engine.ts#L45)
