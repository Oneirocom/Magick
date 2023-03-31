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

[packages/engine/src/lib/types.ts:282](https://github.com/Oneirocom/MagickML/blob/563ea9fe/packages/engine/src/lib/types.ts#L282)

___

### completion

• `Optional` **completion**: (`body`: [`CompletionBody`](../#completionbody)) => `Promise`<[`CompletionResponse`](../#completionresponse)\>

#### Type declaration

▸ (`body`): `Promise`<[`CompletionResponse`](../#completionresponse)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `body` | [`CompletionBody`](../#completionbody) |

##### Returns

`Promise`<[`CompletionResponse`](../#completionresponse)\>

#### Inherited from

EngineContext.completion

#### Defined in

[packages/engine/src/lib/types.ts:199](https://github.com/Oneirocom/MagickML/blob/563ea9fe/packages/engine/src/lib/types.ts#L199)

___

### getSpell

• **getSpell**: [`GetSpell`](../#getspell)

#### Inherited from

EngineContext.getSpell

#### Defined in

[packages/engine/src/lib/types.ts:200](https://github.com/Oneirocom/MagickML/blob/563ea9fe/packages/engine/src/lib/types.ts#L200)

___

### onDebug

• **onDebug**: [`OnDebug`](../#ondebug)

#### Defined in

[packages/engine/src/lib/types.ts:281](https://github.com/Oneirocom/MagickML/blob/563ea9fe/packages/engine/src/lib/types.ts#L281)

___

### onInspector

• **onInspector**: [`OnInspector`](../#oninspector)

#### Defined in

[packages/engine/src/lib/types.ts:279](https://github.com/Oneirocom/MagickML/blob/563ea9fe/packages/engine/src/lib/types.ts#L279)

___

### onPlaytest

• **onPlaytest**: [`OnEditor`](../#oneditor)

#### Defined in

[packages/engine/src/lib/types.ts:280](https://github.com/Oneirocom/MagickML/blob/563ea9fe/packages/engine/src/lib/types.ts#L280)

___

### onTrigger

• **onTrigger**: (`node`: `string` \| [`MagickNode`](../#magicknode), `callback`: (`data`: `unknown`) => `void`) => () => `void`

#### Type declaration

▸ (`node`, `callback`): () => `void`

**`Deprecated`**

The method should not be used

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

[packages/engine/src/lib/types.ts:272](https://github.com/Oneirocom/MagickML/blob/563ea9fe/packages/engine/src/lib/types.ts#L272)

___

### processCode

• `Optional` **processCode**: [`ProcessCode`](../#processcode)

#### Inherited from

EngineContext.processCode

#### Defined in

[packages/engine/src/lib/types.ts:201](https://github.com/Oneirocom/MagickML/blob/563ea9fe/packages/engine/src/lib/types.ts#L201)

___

### refreshEventTable

• **refreshEventTable**: () => `void`

#### Type declaration

▸ (): `void`

##### Returns

`void`

#### Defined in

[packages/engine/src/lib/types.ts:283](https://github.com/Oneirocom/MagickML/blob/563ea9fe/packages/engine/src/lib/types.ts#L283)

___

### runSpell

• **runSpell**: [`RunSpell`](../#runspell)<`Record`<`string`, `unknown`\>\>

#### Inherited from

EngineContext.runSpell

#### Defined in

[packages/engine/src/lib/types.ts:198](https://github.com/Oneirocom/MagickML/blob/563ea9fe/packages/engine/src/lib/types.ts#L198)

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

[packages/engine/src/lib/types.ts:278](https://github.com/Oneirocom/MagickML/blob/563ea9fe/packages/engine/src/lib/types.ts#L278)

___

### sendToInspector

• **sendToInspector**: [`PublishEditorEvent`](../#publisheditorevent)

#### Defined in

[packages/engine/src/lib/types.ts:277](https://github.com/Oneirocom/MagickML/blob/563ea9fe/packages/engine/src/lib/types.ts#L277)

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

[packages/engine/src/lib/types.ts:276](https://github.com/Oneirocom/MagickML/blob/563ea9fe/packages/engine/src/lib/types.ts#L276)
