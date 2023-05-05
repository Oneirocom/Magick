---
id: "WorldManager"
title: "Class: WorldManager"
sidebar_label: "WorldManager"
sidebar_position: 0
custom_edit_url: null
---

A class to manage users and their actions in 3D world.

## Constructors

### constructor

• **new WorldManager**()

#### Defined in

[packages/core/shared/src/world/worldManager.ts:10](https://github.com/Oneirocom/Magick/blob/0b84928f/packages/core/shared/src/world/worldManager.ts#L10)

## Properties

### rooms

• `Private` **rooms**: `Record`<`string`, `World3D`[]\> = `{}`

#### Defined in

[packages/core/shared/src/world/worldManager.ts:8](https://github.com/Oneirocom/Magick/blob/0b84928f/packages/core/shared/src/world/worldManager.ts#L8)

## Methods

### addUser

▸ **addUser**(`user`, `client`): `void`

Adds a user to a room associated with a client.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `user` | `string` | User to add |
| `client` | `string` | Client identifier |

#### Returns

`void`

#### Defined in

[packages/core/shared/src/world/worldManager.ts:19](https://github.com/Oneirocom/Magick/blob/0b84928f/packages/core/shared/src/world/worldManager.ts#L19)

___

### agentCanResponse

▸ **agentCanResponse**(`user`, `client`): `boolean`

Checks if agent can respond in a room.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `user` | `string` | User to check |
| `client` | `string` | Client identifier |

#### Returns

`boolean`

True if agent can respond, false otherwise

#### Defined in

[packages/core/shared/src/world/worldManager.ts:135](https://github.com/Oneirocom/Magick/blob/0b84928f/packages/core/shared/src/world/worldManager.ts#L135)

___

### getUsersDistance

▸ **getUsersDistance**(`user`, `client`): `undefined` \| `number`

Gets the distance between users in a room.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `user` | `string` | User to check distance for |
| `client` | `string` | Client identifier |

#### Returns

`undefined` \| `number`

Users distance or undefined

#### Defined in

[packages/core/shared/src/world/worldManager.ts:70](https://github.com/Oneirocom/Magick/blob/0b84928f/packages/core/shared/src/world/worldManager.ts#L70)

___

### print

▸ **print**(): `void`

Prints the rooms and their states.

#### Returns

`void`

#### Defined in

[packages/core/shared/src/world/worldManager.ts:154](https://github.com/Oneirocom/Magick/blob/0b84928f/packages/core/shared/src/world/worldManager.ts#L154)

___

### removeUser

▸ **removeUser**(`user`, `client`): `void`

Removes a user from a room associated with a client.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `user` | `string` | User to remove |
| `client` | `string` | Client identifier |

#### Returns

`void`

#### Defined in

[packages/core/shared/src/world/worldManager.ts:42](https://github.com/Oneirocom/Magick/blob/0b84928f/packages/core/shared/src/world/worldManager.ts#L42)

___

### userGotInConversationFromAgent

▸ **userGotInConversationFromAgent**(`user`, `client`): `undefined` \| `number`

#### Parameters

| Name | Type |
| :------ | :------ |
| `user` | `string` |
| `client` | `string` |

#### Returns

`undefined` \| `number`

#### Defined in

[packages/core/shared/src/world/worldManager.ts:101](https://github.com/Oneirocom/Magick/blob/0b84928f/packages/core/shared/src/world/worldManager.ts#L101)

___

### userPingedSomeoneElse

▸ **userPingedSomeoneElse**(`user`, `client`): `undefined` \| `number`

#### Parameters

| Name | Type |
| :------ | :------ |
| `user` | `string` |
| `client` | `string` |

#### Returns

`undefined` \| `number`

#### Defined in

[packages/core/shared/src/world/worldManager.ts:115](https://github.com/Oneirocom/Magick/blob/0b84928f/packages/core/shared/src/world/worldManager.ts#L115)

___

### userTalkedSameTopic

▸ **userTalkedSameTopic**(`user`, `client`): `undefined` \| `number`

#### Parameters

| Name | Type |
| :------ | :------ |
| `user` | `string` |
| `client` | `string` |

#### Returns

`undefined` \| `number`

#### Defined in

[packages/core/shared/src/world/worldManager.ts:87](https://github.com/Oneirocom/Magick/blob/0b84928f/packages/core/shared/src/world/worldManager.ts#L87)
