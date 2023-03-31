---
id: "CostCalculator"
title: "Module: CostCalculator"
sidebar_label: "CostCalculator"
sidebar_position: 0
custom_edit_url: null
---

This exports all the modules from Cost Calculator library

## Enumerations

- [ChatModel](../enums/CostCalculator.ChatModel.md)
- [EmbeddingModel](../enums/CostCalculator.EmbeddingModel.md)
- [TextModel](../enums/CostCalculator.TextModel.md)

## Type Aliases

### CostPerToken

Ƭ **CostPerToken**<`T`\>: { [key in T]: number }

Represents the cost per token for a given model

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`TextModel`](../enums/CostCalculator.TextModel.md) \| [`EmbeddingModel`](../enums/CostCalculator.EmbeddingModel.md) \| [`ChatModel`](../enums/CostCalculator.ChatModel.md) |

#### Defined in

[packages/cost-calculator/src/lib/cost-calculator.ts:33](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/cost-calculator/src/lib/cost-calculator.ts#L33)

## Variables

### COST\_PER\_TOKEN

• `Const` **COST\_PER\_TOKEN**: [`CostPerToken`](CostCalculator.md#costpertoken)<[`TextModel`](../enums/CostCalculator.TextModel.md) \| [`EmbeddingModel`](../enums/CostCalculator.EmbeddingModel.md) \| [`ChatModel`](../enums/CostCalculator.ChatModel.md)\>

The cost per token for each TextModel, EmbeddingModel and ChatModel

#### Defined in

[packages/cost-calculator/src/lib/cost-calculator.ts:40](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/cost-calculator/src/lib/cost-calculator.ts#L40)

## Functions

### calculateCompletionCost

▸ **calculateCompletionCost**(`params`): `number`

Calculates the cost of completing a given number of tokens
for a given TextModel or ChatModel

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | `Object` | The parameters for the function |
| `params.model` | [`TextModel`](../enums/CostCalculator.TextModel.md) \| [`ChatModel`](../enums/CostCalculator.ChatModel.md) | The model to be used |
| `params.totalTokens` | `number` | The total number of tokens |

#### Returns

`number`

#### Defined in

[packages/cost-calculator/src/lib/cost-calculator.ts:62](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/cost-calculator/src/lib/cost-calculator.ts#L62)

___

### calculateEmbeddingCost

▸ **calculateEmbeddingCost**(`params`): `number`

Calculates the cost for a given number of tokens
for a given EmbeddingModel

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | `Object` | The parameters for the function |
| `params.model` | [`EmbeddingModel`](../enums/CostCalculator.EmbeddingModel.md) | The model to be used |
| `params.tokens` | `number` | The number of tokens |

#### Returns

`number`

#### Defined in

[packages/cost-calculator/src/lib/cost-calculator.ts:80](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/cost-calculator/src/lib/cost-calculator.ts#L80)
