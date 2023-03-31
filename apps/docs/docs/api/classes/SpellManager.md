---
id: "SpellManager"
title: "Class: SpellManager"
sidebar_label: "SpellManager"
sidebar_position: 0
custom_edit_url: null
---

## Constructors

### constructor

• **new SpellManager**(`«destructured»`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `SpellManagerArgs` |

#### Defined in

[packages/engine/src/lib/spellManager/SpellManager.ts:18](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/spellManager/SpellManager.ts#L18)

## Properties

### cache

• **cache**: `boolean`

#### Defined in

[packages/engine/src/lib/spellManager/SpellManager.ts:15](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/spellManager/SpellManager.ts#L15)

___

### magickInterface

• **magickInterface**: [`EngineContext`](../#enginecontext)<`Record`<`string`, `unknown`\>\>

#### Defined in

[packages/engine/src/lib/spellManager/SpellManager.ts:16](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/spellManager/SpellManager.ts#L16)

___

### socket

• `Optional` **socket**: `Socket`<`DefaultEventsMap`, `DefaultEventsMap`, `DefaultEventsMap`, `any`\>

#### Defined in

[packages/engine/src/lib/spellManager/SpellManager.ts:14](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/spellManager/SpellManager.ts#L14)

___

### spellRunnerMap

• **spellRunnerMap**: `Map`<`string`, [`SpellRunner`](SpellRunner.md)\>

#### Defined in

[packages/engine/src/lib/spellManager/SpellManager.ts:13](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/spellManager/SpellManager.ts#L13)

## Methods

### clear

▸ **clear**(): `void`

#### Returns

`void`

#### Defined in

[packages/engine/src/lib/spellManager/SpellManager.ts:75](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/spellManager/SpellManager.ts#L75)

___

### getSpellRunner

▸ **getSpellRunner**(`spellId`): `undefined` \| [`SpellRunner`](SpellRunner.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `spellId` | `string` |

#### Returns

`undefined` \| [`SpellRunner`](SpellRunner.md)

#### Defined in

[packages/engine/src/lib/spellManager/SpellManager.ts:67](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/spellManager/SpellManager.ts#L67)

___

### hasSpellRunner

▸ **hasSpellRunner**(`spellId`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `spellId` | `string` |

#### Returns

`boolean`

#### Defined in

[packages/engine/src/lib/spellManager/SpellManager.ts:71](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/spellManager/SpellManager.ts#L71)

___

### load

▸ **load**(`spell`, `overload?`): `Promise`<`undefined` \| [`SpellRunner`](SpellRunner.md)\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `spell` | `Object` | `undefined` |
| `spell.createdAt?` | `string` | `undefined` |
| `spell.graph` | { id: string; nodes: any; } | `undefined` |
| `spell.hash` | `string` | `undefined` |
| `spell.id` | `string` | `undefined` |
| `spell.name` | `string` | `undefined` |
| `spell.projectId` | `string` | `undefined` |
| `spell.updatedAt?` | `string` | `undefined` |
| `overload` | `boolean` | `false` |

#### Returns

`Promise`<`undefined` \| [`SpellRunner`](SpellRunner.md)\>

#### Defined in

[packages/engine/src/lib/spellManager/SpellManager.ts:79](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/spellManager/SpellManager.ts#L79)

___

### processMagickInterface

▸ **processMagickInterface**(`magickInterface`): [`EngineContext`](../#enginecontext)<`Record`<`string`, `unknown`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `magickInterface` | `any` |

#### Returns

[`EngineContext`](../#enginecontext)<`Record`<`string`, `unknown`\>\>

#### Defined in

[packages/engine/src/lib/spellManager/SpellManager.ts:31](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/spellManager/SpellManager.ts#L31)

___

### run

▸ **run**(`spellId`, `inputs`, `secrets`, `publicVariables`): `Promise`<`Record`<`string`, `unknown`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `spellId` | `string` |
| `inputs` | [`MagickSpellInput`](../#magickspellinput) |
| `secrets` | `Record`<`string`, `string`\> |
| `publicVariables` | `any` |

#### Returns

`Promise`<`Record`<`string`, `unknown`\>\>

#### Defined in

[packages/engine/src/lib/spellManager/SpellManager.ts:100](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/spellManager/SpellManager.ts#L100)
