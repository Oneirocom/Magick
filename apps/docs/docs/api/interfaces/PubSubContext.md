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

[packages/engine/src/lib/types.ts:246](https://github.com/Oneirocom/MagickML/blob/f4db6e49/packages/engine/src/lib/types.ts#L246)

___

### events

• **events**: [`PubSubEvents`](../#pubsubevents)

#### Defined in

[packages/engine/src/lib/types.ts:247](https://github.com/Oneirocom/MagickML/blob/f4db6e49/packages/engine/src/lib/types.ts#L247)

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

[packages/engine/src/lib/types.ts:240](https://github.com/Oneirocom/MagickML/blob/f4db6e49/packages/engine/src/lib/types.ts#L240)

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

[packages/engine/src/lib/types.ts:242](https://github.com/Oneirocom/MagickML/blob/f4db6e49/packages/engine/src/lib/types.ts#L242)
