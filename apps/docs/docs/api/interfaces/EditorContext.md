---
id: "EditorContext"
title: "Interface: EditorContext"
sidebar_label: "EditorContext"
sidebar_position: 0
custom_edit_url: null
---

## Hierarchy

- [`EngineContext`](../#enginecontext)

  ↳ **`EditorContext`**

## Properties

### clearTextEditor

• **clearTextEditor**: () => `void`

#### Type declaration

▸ (): `void`

##### Returns

`void`

#### Defined in

[packages/core/shared/src/types.ts:291](https://github.com/Oneirocom/Magick/blob/c560ff45/packages/core/shared/src/types.ts#L291)

___

### getSpell

• **getSpell**: [`GetSpell`](../#getspell)

#### Inherited from

EngineContext.getSpell

#### Defined in

[packages/core/shared/src/types.ts:210](https://github.com/Oneirocom/Magick/blob/c560ff45/packages/core/shared/src/types.ts#L210)

___

### onDebug

• **onDebug**: [`OnDebug`](../#ondebug)

#### Defined in

[packages/core/shared/src/types.ts:290](https://github.com/Oneirocom/Magick/blob/c560ff45/packages/core/shared/src/types.ts#L290)

___

### onInspector

• **onInspector**: [`OnInspector`](../#oninspector)

#### Defined in

[packages/core/shared/src/types.ts:288](https://github.com/Oneirocom/Magick/blob/c560ff45/packages/core/shared/src/types.ts#L288)

___

### onPlaytest

• **onPlaytest**: [`OnEditor`](../#oneditor)

#### Defined in

[packages/core/shared/src/types.ts:289](https://github.com/Oneirocom/Magick/blob/c560ff45/packages/core/shared/src/types.ts#L289)

___

### onTrigger

• **onTrigger**: (`node`: `string` \| [`MagickNode`](../#magicknode), `callback`: (`data`: `unknown`) => `void`) => () => `void`

#### Type declaration

▸ (`node`, `callback`): () => `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `node` | `string` \| [`MagickNode`](../#magicknode) |
| `callback` | (`data`: `unknown`) => `void` |

##### Returns

`fn`

▸ (): `void`

##### Returns

`void`

#### Defined in

[packages/core/shared/src/types.ts:281](https://github.com/Oneirocom/Magick/blob/c560ff45/packages/core/shared/src/types.ts#L281)

___

### processCode

• `Optional` **processCode**: [`ProcessCode`](../#processcode)

#### Inherited from

EngineContext.processCode

#### Defined in

[packages/core/shared/src/types.ts:211](https://github.com/Oneirocom/Magick/blob/c560ff45/packages/core/shared/src/types.ts#L211)

___

### refreshEventTable

• **refreshEventTable**: () => `void`

#### Type declaration

▸ (): `void`

##### Returns

`void`

#### Defined in

[packages/core/shared/src/types.ts:292](https://github.com/Oneirocom/Magick/blob/c560ff45/packages/core/shared/src/types.ts#L292)

___

### runSpell

• **runSpell**: [`RunSpell`](../#runspell)<`Record`<`string`, `unknown`\>\>

#### Inherited from

EngineContext.runSpell

#### Defined in

[packages/core/shared/src/types.ts:209](https://github.com/Oneirocom/Magick/blob/c560ff45/packages/core/shared/src/types.ts#L209)

___

### sendToDebug

• **sendToDebug**: (`message`: `unknown`) => `void`

#### Type declaration

▸ (`message`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `message` | `unknown` |

##### Returns

`void`

#### Defined in

[packages/core/shared/src/types.ts:287](https://github.com/Oneirocom/Magick/blob/c560ff45/packages/core/shared/src/types.ts#L287)

___

### sendToInspector

• **sendToInspector**: [`PublishEditorEvent`](../#publisheditorevent)

#### Defined in

[packages/core/shared/src/types.ts:286](https://github.com/Oneirocom/Magick/blob/c560ff45/packages/core/shared/src/types.ts#L286)

___

### sendToPlaytest

• **sendToPlaytest**: (`data`: `string`) => `void`

#### Type declaration

▸ (`data`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `string` |

##### Returns

`void`

#### Defined in

[packages/core/shared/src/types.ts:285](https://github.com/Oneirocom/Magick/blob/c560ff45/packages/core/shared/src/types.ts#L285)
