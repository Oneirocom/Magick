---
id: "SpellRunner"
title: "Class: SpellRunner"
sidebar_label: "SpellRunner"
sidebar_position: 0
custom_edit_url: null
---

## Constructors

### constructor

• **new SpellRunner**(`«destructured»`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `SpellRunnerConstructor` |

#### Defined in

[packages/core/shared/src/spellManager/SpellRunner.ts:67](https://github.com/Oneirocom/Magick/blob/0b84928f/packages/core/shared/src/spellManager/SpellRunner.ts#L67)

## Properties

### agent

• `Optional` **agent**: [`Agent`](Agent.md)

#### Defined in

[packages/core/shared/src/spellManager/SpellRunner.ts:42](https://github.com/Oneirocom/Magick/blob/0b84928f/packages/core/shared/src/spellManager/SpellRunner.ts#L42)

___

### app

• **app**: `Application`<`any`, `any`\>

#### Defined in

[packages/core/shared/src/spellManager/SpellRunner.ts:41](https://github.com/Oneirocom/Magick/blob/0b84928f/packages/core/shared/src/spellManager/SpellRunner.ts#L41)

___

### currentSpell

• **currentSpell**: `Object`

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

#### Defined in

[packages/core/shared/src/spellManager/SpellRunner.ts:37](https://github.com/Oneirocom/Magick/blob/0b84928f/packages/core/shared/src/spellManager/SpellRunner.ts#L37)

___

### engine

• **engine**: [`MagickEngine`](../interfaces/MagickEngine.md)

#### Defined in

[packages/core/shared/src/spellManager/SpellRunner.ts:36](https://github.com/Oneirocom/Magick/blob/0b84928f/packages/core/shared/src/spellManager/SpellRunner.ts#L36)

___

### module

• **module**: `Module`

#### Defined in

[packages/core/shared/src/spellManager/SpellRunner.ts:38](https://github.com/Oneirocom/Magick/blob/0b84928f/packages/core/shared/src/spellManager/SpellRunner.ts#L38)

___

### ranSpells

• **ranSpells**: `string`[] = `[]`

#### Defined in

[packages/core/shared/src/spellManager/SpellRunner.ts:39](https://github.com/Oneirocom/Magick/blob/0b84928f/packages/core/shared/src/spellManager/SpellRunner.ts#L39)

___

### socket

• `Optional` **socket**: ``null`` \| `Socket`<`DefaultEventsMap`, `DefaultEventsMap`, `DefaultEventsMap`, `any`\> = `null`

#### Defined in

[packages/core/shared/src/spellManager/SpellRunner.ts:40](https://github.com/Oneirocom/Magick/blob/0b84928f/packages/core/shared/src/spellManager/SpellRunner.ts#L40)

___

### spellManager

• **spellManager**: [`SpellManager`](SpellManager.md)

#### Defined in

[packages/core/shared/src/spellManager/SpellRunner.ts:43](https://github.com/Oneirocom/Magick/blob/0b84928f/packages/core/shared/src/spellManager/SpellRunner.ts#L43)

## Accessors

### context

• `get` **context**(): `Object`

Getter method which returns the run context for the current spell.

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `app` | `Application`<`any`, `any`\> |
| `currentSpell` | { `createdAt?`: `string` ; `graph`: { nodes: any; id: string; } ; `hash`: `string` ; `id`: `string` ; `name`: `string` ; `projectId`: `string` ; `updatedAt?`: `string`  } |
| `currentSpell.createdAt?` | `string` |
| `currentSpell.graph` | { nodes: any; id: string; } |
| `currentSpell.hash` | `string` |
| `currentSpell.id` | `string` |
| `currentSpell.name` | `string` |
| `currentSpell.projectId` | `string` |
| `currentSpell.updatedAt?` | `string` |
| `module` | `Module` |
| `projectId` | `string` |
| `spellManager` | [`SpellManager`](SpellManager.md) |

#### Defined in

[packages/core/shared/src/spellManager/SpellRunner.ts:106](https://github.com/Oneirocom/Magick/blob/0b84928f/packages/core/shared/src/spellManager/SpellRunner.ts#L106)

___

### inputKeys

• `get` **inputKeys**(): `string`[]

#### Returns

`string`[]

#### Defined in

[packages/core/shared/src/spellManager/SpellRunner.ts:117](https://github.com/Oneirocom/Magick/blob/0b84928f/packages/core/shared/src/spellManager/SpellRunner.ts#L117)

___

### inputs

• `get` **inputs**(): `Map`<`string`, `Socket`\>

Getter method for the inputs for the loaded spell

#### Returns

`Map`<`string`, `Socket`\>

#### Defined in

[packages/core/shared/src/spellManager/SpellRunner.ts:99](https://github.com/Oneirocom/Magick/blob/0b84928f/packages/core/shared/src/spellManager/SpellRunner.ts#L99)

___

### outputData

• `get` **outputData**(): `Record`<`string`, `unknown`\>

Getter method to return a formatted set of outputs of the most recent spell run.

#### Returns

`Record`<`string`, `unknown`\>

#### Defined in

[packages/core/shared/src/spellManager/SpellRunner.ts:124](https://github.com/Oneirocom/Magick/blob/0b84928f/packages/core/shared/src/spellManager/SpellRunner.ts#L124)

___

### triggerIns

• `get` **triggerIns**(): `Map`<`string`, `Socket`\>

Getter method for the triggers ins for the loaded spell

#### Returns

`Map`<`string`, `Socket`\>

#### Defined in

[packages/core/shared/src/spellManager/SpellRunner.ts:92](https://github.com/Oneirocom/Magick/blob/0b84928f/packages/core/shared/src/spellManager/SpellRunner.ts#L92)

## Methods

### \_clearRanSpellCache

▸ `Private` **_clearRanSpellCache**(): `void`

Clears the cache of spells which the runner has ran.

#### Returns

`void`

#### Defined in

[packages/core/shared/src/spellManager/SpellRunner.ts:133](https://github.com/Oneirocom/Magick/blob/0b84928f/packages/core/shared/src/spellManager/SpellRunner.ts#L133)

___

### \_formatInputs

▸ `Private` **_formatInputs**(`inputs`): `Record`<`string`, `unknown`[]\>

Used to format inputs into the format the moduel runner expects.
Takes a normal object of type { key: value } and returns an object
of shape { key: [value] }.  This shape isa required when running the spell
since that is the shape that rete inputs take when processing the graph.

#### Parameters

| Name | Type |
| :------ | :------ |
| `inputs` | `any` |

#### Returns

`Record`<`string`, `unknown`[]\>

#### Defined in

[packages/core/shared/src/spellManager/SpellRunner.ts:143](https://github.com/Oneirocom/Magick/blob/0b84928f/packages/core/shared/src/spellManager/SpellRunner.ts#L143)

___

### \_formatOutputs

▸ `Private` **_formatOutputs**(`rawOutputs`): `Record`<`string`, `unknown`\>

Takes the set of raw outputs, which makes use of the socket key,
and swaps the socket key for the socket name for human readable outputs.

#### Parameters

| Name | Type |
| :------ | :------ |
| `rawOutputs` | `Record`<`string`, `unknown`\> |

#### Returns

`Record`<`string`, `unknown`\>

#### Defined in

[packages/core/shared/src/spellManager/SpellRunner.ts:161](https://github.com/Oneirocom/Magick/blob/0b84928f/packages/core/shared/src/spellManager/SpellRunner.ts#L161)

___

### \_getComponent

▸ `Private` **_getComponent**(`componentName`): `undefined` \| `Component`

Gewts a single component from the engine by name.

#### Parameters

| Name | Type |
| :------ | :------ |
| `componentName` | `string` |

#### Returns

`undefined` \| `Component`

#### Defined in

[packages/core/shared/src/spellManager/SpellRunner.ts:153](https://github.com/Oneirocom/Magick/blob/0b84928f/packages/core/shared/src/spellManager/SpellRunner.ts#L153)

___

### \_getTriggeredNodeByName

▸ `Private` **_getTriggeredNodeByName**(`componentName`): `undefined` \| `NodeData`

Allows us to grab a specific triggered node by name

#### Parameters

| Name | Type |
| :------ | :------ |
| `componentName` | `any` |

#### Returns

`undefined` \| `NodeData`

#### Defined in

[packages/core/shared/src/spellManager/SpellRunner.ts:182](https://github.com/Oneirocom/Magick/blob/0b84928f/packages/core/shared/src/spellManager/SpellRunner.ts#L182)

___

### \_resetTasks

▸ `Private` **_resetTasks**(): `void`

Resets all tasks.  This clears the cached data output of the task and prepares
it for the next run.

#### Returns

`void`

#### Defined in

[packages/core/shared/src/spellManager/SpellRunner.ts:199](https://github.com/Oneirocom/Magick/blob/0b84928f/packages/core/shared/src/spellManager/SpellRunner.ts#L199)

___

### loadSpell

▸ **loadSpell**(`spell`): `Promise`<`void`\>

Loads a spell into the spell runner.

#### Parameters

| Name | Type |
| :------ | :------ |
| `spell` | `Object` |
| `spell.createdAt?` | `string` |
| `spell.graph` | { nodes: any; id: string; } |
| `spell.hash` | `string` |
| `spell.id` | `string` |
| `spell.name` | `string` |
| `spell.projectId` | `string` |
| `spell.updatedAt?` | `string` |

#### Returns

`Promise`<`void`\>

#### Defined in

[packages/core/shared/src/spellManager/SpellRunner.ts:218](https://github.com/Oneirocom/Magick/blob/0b84928f/packages/core/shared/src/spellManager/SpellRunner.ts#L218)

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

[packages/core/shared/src/spellManager/SpellRunner.ts:45](https://github.com/Oneirocom/Magick/blob/0b84928f/packages/core/shared/src/spellManager/SpellRunner.ts#L45)

___

### runComponent

▸ **runComponent**(`«destructured»`): `Promise`<`void` \| `Record`<`string`, `unknown`\>\>

Main spell runner for now. Processes inputs, gets the right component that starts the
running.  Would be even better if we just took a node identifier, got its
component, and ran the one triggered rather than this slightly hacky hard coded
method.

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `RunComponentArgs` |

#### Returns

`Promise`<`void` \| `Record`<`string`, `unknown`\>\>

#### Defined in

[packages/core/shared/src/spellManager/SpellRunner.ts:237](https://github.com/Oneirocom/Magick/blob/0b84928f/packages/core/shared/src/spellManager/SpellRunner.ts#L237)

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

[packages/core/shared/src/spellManager/SpellRunner.ts:56](https://github.com/Oneirocom/Magick/blob/0b84928f/packages/core/shared/src/spellManager/SpellRunner.ts#L56)
