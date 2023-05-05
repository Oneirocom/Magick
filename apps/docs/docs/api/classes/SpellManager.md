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

[packages/core/shared/src/spellManager/SpellManager.ts:32](https://github.com/Oneirocom/Magick/blob/eb9f05ef/packages/core/shared/src/spellManager/SpellManager.ts#L32)

## Properties

### agent

• `Optional` **agent**: [`Agent`](Agent.md)

#### Defined in

[packages/core/shared/src/spellManager/SpellManager.ts:30](https://github.com/Oneirocom/Magick/blob/eb9f05ef/packages/core/shared/src/spellManager/SpellManager.ts#L30)

___

### app

• **app**: `Application`<`any`, `any`\>

#### Defined in

[packages/core/shared/src/spellManager/SpellManager.ts:29](https://github.com/Oneirocom/Magick/blob/eb9f05ef/packages/core/shared/src/spellManager/SpellManager.ts#L29)

___

### cache

• **cache**: `boolean`

#### Defined in

[packages/core/shared/src/spellManager/SpellManager.ts:28](https://github.com/Oneirocom/Magick/blob/eb9f05ef/packages/core/shared/src/spellManager/SpellManager.ts#L28)

___

### socket

• `Optional` **socket**: `Socket`<`DefaultEventsMap`, `DefaultEventsMap`, `DefaultEventsMap`, `any`\>

#### Defined in

[packages/core/shared/src/spellManager/SpellManager.ts:27](https://github.com/Oneirocom/Magick/blob/eb9f05ef/packages/core/shared/src/spellManager/SpellManager.ts#L27)

___

### spellRunnerMap

• **spellRunnerMap**: `Map`<`string`, [`SpellRunner`](SpellRunner.md)\>

#### Defined in

[packages/core/shared/src/spellManager/SpellManager.ts:26](https://github.com/Oneirocom/Magick/blob/eb9f05ef/packages/core/shared/src/spellManager/SpellManager.ts#L26)

## Methods

### clear

▸ **clear**(): `void`

#### Returns

`void`

#### Defined in

[packages/core/shared/src/spellManager/SpellManager.ts:63](https://github.com/Oneirocom/Magick/blob/eb9f05ef/packages/core/shared/src/spellManager/SpellManager.ts#L63)

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

[packages/core/shared/src/spellManager/SpellManager.ts:55](https://github.com/Oneirocom/Magick/blob/eb9f05ef/packages/core/shared/src/spellManager/SpellManager.ts#L55)

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

[packages/core/shared/src/spellManager/SpellManager.ts:59](https://github.com/Oneirocom/Magick/blob/eb9f05ef/packages/core/shared/src/spellManager/SpellManager.ts#L59)

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

[packages/core/shared/src/spellManager/SpellManager.ts:78](https://github.com/Oneirocom/Magick/blob/eb9f05ef/packages/core/shared/src/spellManager/SpellManager.ts#L78)

___

### loadById

▸ **loadById**(`spellId`): `Promise`<`undefined` \| ``null`` \| [`SpellRunner`](SpellRunner.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `spellId` | `string` |

#### Returns

`Promise`<`undefined` \| ``null`` \| [`SpellRunner`](SpellRunner.md)\>

#### Defined in

[packages/core/shared/src/spellManager/SpellManager.ts:67](https://github.com/Oneirocom/Magick/blob/eb9f05ef/packages/core/shared/src/spellManager/SpellManager.ts#L67)

___

### run

▸ **run**(`«destructured»`): `Promise`<`Record`<`string`, `unknown`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `RunArgs` |

#### Returns

`Promise`<`Record`<`string`, `unknown`\>\>

#### Defined in

[packages/core/shared/src/spellManager/SpellManager.ts:102](https://github.com/Oneirocom/Magick/blob/eb9f05ef/packages/core/shared/src/spellManager/SpellManager.ts#L102)
