---
id: "engine_src.PubSubContext"
title: "Interface: PubSubContext"
sidebar_label: "engine/src.PubSubContext"
custom_edit_url: null
---

[engine/src](../modules/engine_src.md).PubSubContext

## Properties

### PubSub

• **PubSub**: `Base`<`any`, `Message`\>

#### Defined in

[packages/engine/src/lib/types.ts:246](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/types.ts#L246)

___

### events

• **events**: [`PubSubEvents`](../modules/engine_src.md#pubsubevents)

#### Defined in

[packages/engine/src/lib/types.ts:247](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/types.ts#L247)

___

### publish

• **publish**: (`event`: `string`, `data?`: [`PubSubData`](../modules/engine_src.md#pubsubdata)) => `boolean`

#### Type declaration

▸ (`event`, `data?`): `boolean`

##### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` |
| `data?` | [`PubSubData`](../modules/engine_src.md#pubsubdata) |

##### Returns

`boolean`

#### Defined in

[packages/engine/src/lib/types.ts:240](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/types.ts#L240)

## Methods

### subscribe

▸ **subscribe**(`event`, `func`): () => `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` |
| `func` | `SubscriptionListener`<[`PubSubData`](../modules/engine_src.md#pubsubdata)\> |

#### Returns

`fn`

▸ (): `void`

##### Returns

`void`

#### Defined in

[packages/engine/src/lib/types.ts:242](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/types.ts#L242)
