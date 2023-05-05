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

[packages/core/shared/src/spellManager/SpellManager.ts:16](https://github.com/Oneirocom/Magick/blob/c560ff45/packages/core/shared/src/spellManager/SpellManager.ts#L16)

## Properties

### cache

• **cache**: `boolean`

#### Defined in

[packages/core/shared/src/spellManager/SpellManager.ts:14](https://github.com/Oneirocom/Magick/blob/c560ff45/packages/core/shared/src/spellManager/SpellManager.ts#L14)

___

### socket

• `Optional` **socket**: `Socket`<`DefaultEventsMap`, `DefaultEventsMap`, `DefaultEventsMap`, `any`\>

#### Defined in

[packages/core/shared/src/spellManager/SpellManager.ts:13](https://github.com/Oneirocom/Magick/blob/c560ff45/packages/core/shared/src/spellManager/SpellManager.ts#L13)

___

### spellRunnerMap

• **spellRunnerMap**: `Map`<`string`, [`SpellRunner`](SpellRunner.md)\>

#### Defined in

[packages/core/shared/src/spellManager/SpellManager.ts:12](https://github.com/Oneirocom/Magick/blob/c560ff45/packages/core/shared/src/spellManager/SpellManager.ts#L12)

## Methods

### clear

▸ **clear**(): `void`

#### Returns

`void`

#### Defined in

[packages/core/shared/src/spellManager/SpellManager.ts:33](https://github.com/Oneirocom/Magick/blob/c560ff45/packages/core/shared/src/spellManager/SpellManager.ts#L33)

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

[packages/core/shared/src/spellManager/SpellManager.ts:25](https://github.com/Oneirocom/Magick/blob/c560ff45/packages/core/shared/src/spellManager/SpellManager.ts#L25)

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

[packages/core/shared/src/spellManager/SpellManager.ts:29](https://github.com/Oneirocom/Magick/blob/c560ff45/packages/core/shared/src/spellManager/SpellManager.ts#L29)

___

### load

▸ **load**(`spell`, `overload?`): `Promise`<`undefined` \| [`SpellRunner`](SpellRunner.md)\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `spell` | `Object` | `undefined` |
| `spell.createdAt?` | `string` | `undefined` |
| `spell.graph` | { nodes: any; id: string; } | `undefined` |
| `spell.hash` | `string` | `undefined` |
| `spell.id` | `string` | `undefined` |
| `spell.name` | `string` | `undefined` |
| `spell.projectId` | `string` | `undefined` |
| `spell.updatedAt?` | `string` | `undefined` |
| `overload` | `boolean` | `false` |

#### Returns

`Promise`<`undefined` \| [`SpellRunner`](SpellRunner.md)\>

#### Defined in

[packages/core/shared/src/spellManager/SpellManager.ts:37](https://github.com/Oneirocom/Magick/blob/c560ff45/packages/core/shared/src/spellManager/SpellManager.ts#L37)

___

### run

▸ **run**(`spellId`, `inputs`, `secrets`, `publicVariables`, `app`): `Promise`<`Record`<`string`, `unknown`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `spellId` | `string` |
| `inputs` | [`MagickSpellInput`](../#magickspellinput) |
| `secrets` | `Record`<`string`, `string`\> |
| `publicVariables` | `any` |
| `app` | `any` |

#### Returns

`Promise`<`Record`<`string`, `unknown`\>\>

#### Defined in

[packages/core/shared/src/spellManager/SpellManager.ts:55](https://github.com/Oneirocom/Magick/blob/c560ff45/packages/core/shared/src/spellManager/SpellManager.ts#L55)
