---
id: "Agent"
title: "Class: Agent"
sidebar_label: "Agent"
sidebar_position: 0
custom_edit_url: null
---

The Agent class that implements AgentInterface.

## Implements

- [`AgentInterface`](../#agentinterface)

## Constructors

### constructor

• **new Agent**(`agentData`, `agentManager`, `app`)

Agent constructor initializes properties and sets intervals for updating agents

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `agentData` | `Object` | {AgentData} - The instance's data. |
| `agentData.data?` | `any` | - |
| `agentData.enabled?` | `boolean` | - |
| `agentData.id` | `string` | - |
| `agentData.name` | `string` | - |
| `agentData.pingedAt?` | `string` | - |
| `agentData.projectId` | `string` | - |
| `agentData.publicVariables?` | `any` | - |
| `agentData.rootSpell?` | `any` | - |
| `agentData.secrets?` | `string` | - |
| `agentData.updatedAt?` | `string` | - |
| `agentManager` | [`AgentManager`](AgentManager.md) | {AgentManager} - The instance's manager. |
| `app` | `Application`<`any`, `any`\> | - |

#### Defined in

[packages/core/shared/src/agents/Agent.ts:35](https://github.com/Oneirocom/Magick/blob/eb9f05ef/packages/core/shared/src/agents/Agent.ts#L35)

## Properties

### agentManager

• **agentManager**: [`AgentManager`](AgentManager.md)

#### Defined in

[packages/core/shared/src/agents/Agent.ts:23](https://github.com/Oneirocom/Magick/blob/eb9f05ef/packages/core/shared/src/agents/Agent.ts#L23)

___

### app

• **app**: `any`

#### Defined in

[packages/core/shared/src/agents/Agent.ts:19](https://github.com/Oneirocom/Magick/blob/eb9f05ef/packages/core/shared/src/agents/Agent.ts#L19)

___

### data

• **data**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `data?` | `any` |
| `enabled?` | `boolean` |
| `id` | `string` |
| `name` | `string` |
| `pingedAt?` | `string` |
| `projectId` | `string` |
| `publicVariables?` | `any` |
| `rootSpell?` | `any` |
| `secrets?` | `string` |
| `updatedAt?` | `string` |

#### Implementation of

AgentInterface.data

#### Defined in

[packages/core/shared/src/agents/Agent.ts:18](https://github.com/Oneirocom/Magick/blob/eb9f05ef/packages/core/shared/src/agents/Agent.ts#L18)

___

### id

• **id**: `any`

#### Implementation of

AgentInterface.id

#### Defined in

[packages/core/shared/src/agents/Agent.ts:15](https://github.com/Oneirocom/Magick/blob/eb9f05ef/packages/core/shared/src/agents/Agent.ts#L15)

___

### name

• **name**: `string` = `''`

#### Implementation of

AgentInterface.name

#### Defined in

[packages/core/shared/src/agents/Agent.ts:14](https://github.com/Oneirocom/Magick/blob/eb9f05ef/packages/core/shared/src/agents/Agent.ts#L14)

___

### outputTypes

• **outputTypes**: `any`[] = `[]`

#### Defined in

[packages/core/shared/src/agents/Agent.ts:27](https://github.com/Oneirocom/Magick/blob/eb9f05ef/packages/core/shared/src/agents/Agent.ts#L27)

___

### projectId

• **projectId**: `string`

#### Implementation of

AgentInterface.projectId

#### Defined in

[packages/core/shared/src/agents/Agent.ts:21](https://github.com/Oneirocom/Magick/blob/eb9f05ef/packages/core/shared/src/agents/Agent.ts#L21)

___

### publicVariables

• **publicVariables**: `Record`<`string`, `string`\>

#### Implementation of

AgentInterface.publicVariables

#### Defined in

[packages/core/shared/src/agents/Agent.ts:17](https://github.com/Oneirocom/Magick/blob/eb9f05ef/packages/core/shared/src/agents/Agent.ts#L17)

___

### rootSpell

• **rootSpell**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `createdAt?` | `string` |
| `graph` | { nodes: any; id: string; } |
| `hash` | `string` |
| `id` | `string` |
| `name` | `string` |
| `projectId` | `string` |
| `updatedAt?` | `string` |

#### Implementation of

AgentInterface.rootSpell

#### Defined in

[packages/core/shared/src/agents/Agent.ts:25](https://github.com/Oneirocom/Magick/blob/eb9f05ef/packages/core/shared/src/agents/Agent.ts#L25)

___

### secrets

• **secrets**: `any`

#### Implementation of

AgentInterface.secrets

#### Defined in

[packages/core/shared/src/agents/Agent.ts:16](https://github.com/Oneirocom/Magick/blob/eb9f05ef/packages/core/shared/src/agents/Agent.ts#L16)

___

### spellManager

• **spellManager**: [`SpellManager`](SpellManager.md)

#### Defined in

[packages/core/shared/src/agents/Agent.ts:20](https://github.com/Oneirocom/Magick/blob/eb9f05ef/packages/core/shared/src/agents/Agent.ts#L20)

___

### spellRunner

• `Optional` **spellRunner**: [`SpellRunner`](SpellRunner.md)

#### Defined in

[packages/core/shared/src/agents/Agent.ts:24](https://github.com/Oneirocom/Magick/blob/eb9f05ef/packages/core/shared/src/agents/Agent.ts#L24)

___

### updateInterval

• **updateInterval**: `any`

#### Defined in

[packages/core/shared/src/agents/Agent.ts:28](https://github.com/Oneirocom/Magick/blob/eb9f05ef/packages/core/shared/src/agents/Agent.ts#L28)

___

### worldManager

• **worldManager**: [`WorldManager`](WorldManager.md)

#### Defined in

[packages/core/shared/src/agents/Agent.ts:22](https://github.com/Oneirocom/Magick/blob/eb9f05ef/packages/core/shared/src/agents/Agent.ts#L22)

## Methods

### error

▸ **error**(`message`, `data?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | `any` |
| `data` | `Object` |

#### Returns

`void`

#### Defined in

[packages/core/shared/src/agents/Agent.ts:143](https://github.com/Oneirocom/Magick/blob/eb9f05ef/packages/core/shared/src/agents/Agent.ts#L143)

___

### log

▸ **log**(`message`, `data`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | `any` |
| `data` | `any` |

#### Returns

`void`

#### Defined in

[packages/core/shared/src/agents/Agent.ts:123](https://github.com/Oneirocom/Magick/blob/eb9f05ef/packages/core/shared/src/agents/Agent.ts#L123)

___

### onDestroy

▸ **onDestroy**(): `Promise`<`void`\>

Clean up resources when the instance is destroyed.

#### Returns

`Promise`<`void`\>

#### Defined in

[packages/core/shared/src/agents/Agent.ts:106](https://github.com/Oneirocom/Magick/blob/eb9f05ef/packages/core/shared/src/agents/Agent.ts#L106)

___

### warn

▸ **warn**(`message`, `data`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | `any` |
| `data` | `any` |

#### Returns

`void`

#### Defined in

[packages/core/shared/src/agents/Agent.ts:133](https://github.com/Oneirocom/Magick/blob/eb9f05ef/packages/core/shared/src/agents/Agent.ts#L133)
