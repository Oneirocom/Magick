---
id: "AgentManager"
title: "Class: AgentManager"
sidebar_label: "AgentManager"
sidebar_position: 0
custom_edit_url: null
---

Class for managing agents.

## Constructors

### constructor

• **new AgentManager**(`app`)

Create an agent manager.

#### Parameters

| Name | Type |
| :------ | :------ |
| `app` | `any` |

#### Defined in

[packages/engine/src/lib/agents/AgentManager.ts:28](https://github.com/Oneirocom/MagickML/blob/f4db6e49/packages/engine/src/lib/agents/AgentManager.ts#L28)

## Properties

### addHandlers

• **addHandlers**: `any` = `[]`

#### Defined in

[packages/engine/src/lib/agents/AgentManager.ts:12](https://github.com/Oneirocom/MagickML/blob/f4db6e49/packages/engine/src/lib/agents/AgentManager.ts#L12)

___

### agents

• **agents**: `Object` = `{}`

#### Index signature

▪ [id: `string`]: `any`

#### Defined in

[packages/engine/src/lib/agents/AgentManager.ts:9](https://github.com/Oneirocom/MagickML/blob/f4db6e49/packages/engine/src/lib/agents/AgentManager.ts#L9)

___

### app

• **app**: `any`

#### Defined in

[packages/engine/src/lib/agents/AgentManager.ts:14](https://github.com/Oneirocom/MagickML/blob/f4db6e49/packages/engine/src/lib/agents/AgentManager.ts#L14)

___

### currentAgents

• **currentAgents**: `any` = `[]`

#### Defined in

[packages/engine/src/lib/agents/AgentManager.ts:10](https://github.com/Oneirocom/MagickML/blob/f4db6e49/packages/engine/src/lib/agents/AgentManager.ts#L10)

___

### newAgents

• **newAgents**: `any`

#### Defined in

[packages/engine/src/lib/agents/AgentManager.ts:11](https://github.com/Oneirocom/MagickML/blob/f4db6e49/packages/engine/src/lib/agents/AgentManager.ts#L11)

___

### removeHandlers

• **removeHandlers**: `any` = `[]`

#### Defined in

[packages/engine/src/lib/agents/AgentManager.ts:13](https://github.com/Oneirocom/MagickML/blob/f4db6e49/packages/engine/src/lib/agents/AgentManager.ts#L13)

## Methods

### deleteOldAgents

▸ **deleteOldAgents**(): `Promise`<`void`\>

Delete old agent instances.

#### Returns

`Promise`<`void`\>

#### Defined in

[packages/engine/src/lib/agents/AgentManager.ts:55](https://github.com/Oneirocom/MagickML/blob/f4db6e49/packages/engine/src/lib/agents/AgentManager.ts#L55)

___

### getAgent

▸ **getAgent**(`agent`): `any`

Get the agent with the given agent data.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `agent` | `Object` | The agent data. |

#### Returns

`any`

The agent if found.

#### Defined in

[packages/engine/src/lib/agents/AgentManager.ts:20](https://github.com/Oneirocom/MagickML/blob/f4db6e49/packages/engine/src/lib/agents/AgentManager.ts#L20)

___

### registerAddAgentHandler

▸ **registerAddAgentHandler**(`handler`): `void`

Register a handler to be called when an agent is added.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `handler` | `any` | The handler function to be called. |

#### Returns

`void`

#### Defined in

[packages/engine/src/lib/agents/AgentManager.ts:40](https://github.com/Oneirocom/MagickML/blob/f4db6e49/packages/engine/src/lib/agents/AgentManager.ts#L40)

___

### registerRemoveAgentHandler

▸ **registerRemoveAgentHandler**(`handler`): `void`

Register a handler to be called when an agent is removed.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `handler` | `any` | The handler function to be called. |

#### Returns

`void`

#### Defined in

[packages/engine/src/lib/agents/AgentManager.ts:48](https://github.com/Oneirocom/MagickML/blob/f4db6e49/packages/engine/src/lib/agents/AgentManager.ts#L48)

___

### updateAgents

▸ **updateAgents**(): `Promise`<`void`\>

Update agent instances.

#### Returns

`Promise`<`void`\>

#### Defined in

[packages/engine/src/lib/agents/AgentManager.ts:81](https://github.com/Oneirocom/MagickML/blob/f4db6e49/packages/engine/src/lib/agents/AgentManager.ts#L81)
