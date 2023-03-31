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
| `agentData` | `AgentData` | {AgentData} - The instance's data. |
| `agentManager` | [`AgentManager`](AgentManager.md) | {AgentManager} - The instance's manager. |
| `app` | `any` | - |

#### Defined in

[packages/engine/src/lib/agents/Agent.ts:54](https://github.com/Oneirocom/MagickML/blob/563ea9fe/packages/engine/src/lib/agents/Agent.ts#L54)

## Properties

### agentManager

• **agentManager**: [`AgentManager`](AgentManager.md)

#### Defined in

[packages/engine/src/lib/agents/Agent.ts:42](https://github.com/Oneirocom/MagickML/blob/563ea9fe/packages/engine/src/lib/agents/Agent.ts#L42)

___

### app

• **app**: `any`

#### Defined in

[packages/engine/src/lib/agents/Agent.ts:38](https://github.com/Oneirocom/MagickML/blob/563ea9fe/packages/engine/src/lib/agents/Agent.ts#L38)

___

### data

• **data**: `AgentData`

#### Implementation of

AgentInterface.data

#### Defined in

[packages/engine/src/lib/agents/Agent.ts:37](https://github.com/Oneirocom/MagickML/blob/563ea9fe/packages/engine/src/lib/agents/Agent.ts#L37)

___

### id

• **id**: `any`

#### Implementation of

AgentInterface.id

#### Defined in

[packages/engine/src/lib/agents/Agent.ts:34](https://github.com/Oneirocom/MagickML/blob/563ea9fe/packages/engine/src/lib/agents/Agent.ts#L34)

___

### name

• **name**: `string` = `''`

#### Implementation of

AgentInterface.name

#### Defined in

[packages/engine/src/lib/agents/Agent.ts:33](https://github.com/Oneirocom/MagickML/blob/563ea9fe/packages/engine/src/lib/agents/Agent.ts#L33)

___

### outputTypes

• **outputTypes**: `any`[] = `[]`

#### Defined in

[packages/engine/src/lib/agents/Agent.ts:46](https://github.com/Oneirocom/MagickML/blob/563ea9fe/packages/engine/src/lib/agents/Agent.ts#L46)

___

### projectId

• **projectId**: `string`

#### Implementation of

AgentInterface.projectId

#### Defined in

[packages/engine/src/lib/agents/Agent.ts:40](https://github.com/Oneirocom/MagickML/blob/563ea9fe/packages/engine/src/lib/agents/Agent.ts#L40)

___

### publicVariables

• **publicVariables**: `any`[]

#### Implementation of

AgentInterface.publicVariables

#### Defined in

[packages/engine/src/lib/agents/Agent.ts:36](https://github.com/Oneirocom/MagickML/blob/563ea9fe/packages/engine/src/lib/agents/Agent.ts#L36)

___

### rootSpell

• **rootSpell**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `createdAt?` | `string` |
| `graph` | { id: string; nodes: any; } |
| `hash` | `string` |
| `id` | `string` |
| `name` | `string` |
| `projectId` | `string` |
| `updatedAt?` | `string` |

#### Implementation of

AgentInterface.rootSpell

#### Defined in

[packages/engine/src/lib/agents/Agent.ts:44](https://github.com/Oneirocom/MagickML/blob/563ea9fe/packages/engine/src/lib/agents/Agent.ts#L44)

___

### secrets

• **secrets**: `any`

#### Implementation of

AgentInterface.secrets

#### Defined in

[packages/engine/src/lib/agents/Agent.ts:35](https://github.com/Oneirocom/MagickML/blob/563ea9fe/packages/engine/src/lib/agents/Agent.ts#L35)

___

### spellManager

• **spellManager**: [`SpellManager`](SpellManager.md)

#### Defined in

[packages/engine/src/lib/agents/Agent.ts:39](https://github.com/Oneirocom/MagickML/blob/563ea9fe/packages/engine/src/lib/agents/Agent.ts#L39)

___

### spellRunner

• `Optional` **spellRunner**: [`SpellRunner`](SpellRunner.md)

#### Defined in

[packages/engine/src/lib/agents/Agent.ts:43](https://github.com/Oneirocom/MagickML/blob/563ea9fe/packages/engine/src/lib/agents/Agent.ts#L43)

___

### updateInterval

• **updateInterval**: `any`

#### Defined in

[packages/engine/src/lib/agents/Agent.ts:47](https://github.com/Oneirocom/MagickML/blob/563ea9fe/packages/engine/src/lib/agents/Agent.ts#L47)

___

### worldManager

• **worldManager**: [`WorldManager`](WorldManager.md)

#### Defined in

[packages/engine/src/lib/agents/Agent.ts:41](https://github.com/Oneirocom/MagickML/blob/563ea9fe/packages/engine/src/lib/agents/Agent.ts#L41)

## Methods

### onDestroy

▸ **onDestroy**(): `Promise`<`void`\>

Clean up resources when the instance is destroyed.

#### Returns

`Promise`<`void`\>

#### Defined in

[packages/engine/src/lib/agents/Agent.ts:120](https://github.com/Oneirocom/MagickML/blob/563ea9fe/packages/engine/src/lib/agents/Agent.ts#L120)
