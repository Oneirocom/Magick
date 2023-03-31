---
id: "PubSubContext"
title: "Interface: PubSubContext"
sidebar_label: "PubSubContext"
sidebar_position: 0
custom_edit_url: null
---

## Properties

### PubSub

• **PubSub**: `Base`<`any`, `Message`\>

#### Defined in

[packages/engine/src/lib/types.ts:245](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/types.ts#L245)

___

### events

• **events**: [`PubSubEvents`](../modules.md#pubsubevents)

#### Defined in

[packages/engine/src/lib/types.ts:246](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/types.ts#L246)

___

### publish

• **publish**: (`event`: `string`, `data?`: [`PubSubData`](../modules.md#pubsubdata)) => `boolean`

#### Type declaration

▸ (`event`, `data?`): `boolean`

##### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` |
| `data?` | [`PubSubData`](../modules.md#pubsubdata) |

##### Returns

`boolean`

#### Defined in

[packages/engine/src/lib/types.ts:239](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/types.ts#L239)

## Methods

### subscribe

▸ **subscribe**(`event`, `func`): () => `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` |
| `func` | `SubscriptionListener`<[`PubSubData`](../modules.md#pubsubdata)\> |

#### Returns

`fn`

▸ (): `void`

##### Returns

`void`

#### Defined in

[packages/engine/src/lib/types.ts:241](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/types.ts#L241)
