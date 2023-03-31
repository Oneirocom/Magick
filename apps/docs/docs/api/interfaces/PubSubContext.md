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

[packages/engine/src/lib/types.ts:249](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/types.ts#L249)

___

### events

• **events**: [`PubSubEvents`](../#pubsubevents)

#### Defined in

[packages/engine/src/lib/types.ts:250](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/types.ts#L250)

___

### publish

• **publish**: (`event`: `string`, `data?`: [`PubSubData`](../#pubsubdata)) => `boolean`

#### Type declaration

▸ (`event`, `data?`): `boolean`

##### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` |
| `data?` | [`PubSubData`](../#pubsubdata) |

##### Returns

`boolean`

#### Defined in

[packages/engine/src/lib/types.ts:243](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/types.ts#L243)

## Methods

### subscribe

▸ **subscribe**(`event`, `func`): () => `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` |
| `func` | `SubscriptionListener`<[`PubSubData`](../#pubsubdata)\> |

#### Returns

`fn`

▸ (): `void`

##### Returns

`void`

#### Defined in

[packages/engine/src/lib/types.ts:245](https://github.com/Oneirocom/MagickML/blob/5ec1961d/packages/engine/src/lib/types.ts#L245)
