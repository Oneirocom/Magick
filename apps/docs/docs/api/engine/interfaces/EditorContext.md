---
id: "EditorContext"
title: "Interface: EditorContext"
sidebar_label: "EditorContext"
sidebar_position: 0
custom_edit_url: null
---

## Hierarchy

- [`EngineContext`](../modules.md#enginecontext)

  ↳ **`EditorContext`**

## Properties

### clearTextEditor

• **clearTextEditor**: () => `void`

#### Type declaration

▸ (): `void`

##### Returns

`void`

#### Defined in

[packages/engine/src/lib/types.ts:281](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/types.ts#L281)

___

### completion

• `Optional` **completion**: (`body`: [`CompletionBody`](../modules.md#completionbody)) => `Promise`<[`CompletionResponse`](../modules.md#completionresponse)\>

#### Type declaration

▸ (`body`): `Promise`<[`CompletionResponse`](../modules.md#completionresponse)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `body` | [`CompletionBody`](../modules.md#completionbody) |

##### Returns

`Promise`<[`CompletionResponse`](../modules.md#completionresponse)\>

#### Inherited from

EngineContext.completion

#### Defined in

[packages/engine/src/lib/types.ts:198](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/types.ts#L198)

___

### env

• **env**: [`Env`](../modules.md#env)

#### Inherited from

EngineContext.env

#### Defined in

[packages/engine/src/lib/types.ts:196](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/types.ts#L196)

___

### getSpell

• **getSpell**: [`GetSpell`](../modules.md#getspell)

#### Inherited from

EngineContext.getSpell

#### Defined in

[packages/engine/src/lib/types.ts:199](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/types.ts#L199)

___

### onDebug

• **onDebug**: [`OnDebug`](../modules.md#ondebug)

#### Defined in

[packages/engine/src/lib/types.ts:280](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/types.ts#L280)

___

### onInspector

• **onInspector**: [`OnInspector`](../modules.md#oninspector)

#### Defined in

[packages/engine/src/lib/types.ts:278](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/types.ts#L278)

___

### onPlaytest

• **onPlaytest**: [`OnEditor`](../modules.md#oneditor)

#### Defined in

[packages/engine/src/lib/types.ts:279](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/types.ts#L279)

___

### onTrigger

• **onTrigger**: (`node`: `string` \| [`MagickNode`](../modules.md#magicknode), `callback`: (`data`: `unknown`) => `void`) => () => `void`

#### Type declaration

▸ (`node`, `callback`): () => `void`

**`Deprecated`**

The method should not be used

##### Parameters

| Name | Type |
| :------ | :------ |
| `node` | `string` \| [`MagickNode`](../modules.md#magicknode) |
| `callback` | (`data`: `unknown`) => `void` |

##### Returns

`fn`

▸ (): `void`

##### Returns

`void`

#### Defined in

[packages/engine/src/lib/types.ts:271](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/types.ts#L271)

___

### processCode

• `Optional` **processCode**: [`ProcessCode`](../modules.md#processcode)

#### Inherited from

EngineContext.processCode

#### Defined in

[packages/engine/src/lib/types.ts:200](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/types.ts#L200)

___

### refreshEventTable

• **refreshEventTable**: () => `void`

#### Type declaration

▸ (): `void`

##### Returns

`void`

#### Defined in

[packages/engine/src/lib/types.ts:282](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/types.ts#L282)

___

### runSpell

• **runSpell**: [`RunSpell`](../modules.md#runspell)<`Record`<`string`, `unknown`\>\>

#### Inherited from

EngineContext.runSpell

#### Defined in

[packages/engine/src/lib/types.ts:197](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/types.ts#L197)

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

[packages/engine/src/lib/types.ts:277](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/types.ts#L277)

___

### sendToInspector

• **sendToInspector**: [`PublishEditorEvent`](../modules.md#publisheditorevent)

#### Defined in

[packages/engine/src/lib/types.ts:276](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/types.ts#L276)

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

[packages/engine/src/lib/types.ts:275](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/types.ts#L275)
