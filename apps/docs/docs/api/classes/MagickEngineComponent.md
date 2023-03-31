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

[packages/engine/src/lib/engine.ts:28](https://github.com/Oneirocom/MagickML/blob/7e703a94/packages/engine/src/lib/engine.ts#L28)

## Properties

### data

• **data**: `unknown` = `{}`

#### Defined in

[packages/engine/src/lib/engine.ts:25](https://github.com/Oneirocom/MagickML/blob/7e703a94/packages/engine/src/lib/engine.ts#L25)

___

### engine

• **engine**: ``null`` \| `Engine` = `null`

#### Defined in

[packages/engine/src/lib/engine.ts:26](https://github.com/Oneirocom/MagickML/blob/7e703a94/packages/engine/src/lib/engine.ts#L26)

___

### name

• **name**: `string`

#### Defined in

[packages/engine/src/lib/engine.ts:24](https://github.com/Oneirocom/MagickML/blob/7e703a94/packages/engine/src/lib/engine.ts#L24)

## Methods

### worker

▸ `Abstract` **worker**(`node`, `inputs`, `outputs`, `context`, `...args`): `WorkerReturnType`

#### Parameters

| Name | Type |
| :------ | :------ |
| `node` | [`WorkerData`](../#workerdata) |
| `inputs` | [`MagickWorkerInputs`](../#magickworkerinputs) |
| `outputs` | `WorkerOutputs` |
| `context` | `any` |
| `...args` | `unknown`[] |

#### Returns

`WorkerReturnType`

#### Defined in

[packages/engine/src/lib/engine.ts:32](https://github.com/Oneirocom/MagickML/blob/7e703a94/packages/engine/src/lib/engine.ts#L32)
