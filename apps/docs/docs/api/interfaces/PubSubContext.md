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

[packages/core/shared/src/types.ts:259](https://github.com/Oneirocom/Magick/blob/0b84928f/packages/core/shared/src/types.ts#L259)

___

### events

• **events**: [`PubSubEvents`](../#pubsubevents)

#### Defined in

[packages/core/shared/src/types.ts:260](https://github.com/Oneirocom/Magick/blob/0b84928f/packages/core/shared/src/types.ts#L260)

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

[packages/core/shared/src/types.ts:253](https://github.com/Oneirocom/Magick/blob/0b84928f/packages/core/shared/src/types.ts#L253)

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

[packages/core/shared/src/types.ts:255](https://github.com/Oneirocom/Magick/blob/0b84928f/packages/core/shared/src/types.ts#L255)
