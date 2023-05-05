---
id: "SpellRunner"
title: "Class: SpellRunner"
sidebar_label: "SpellRunner"
sidebar_position: 0
custom_edit_url: null
---

## Constructors

### constructor

• **new SpellRunner**(`socket?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `socket?` | `Socket`<`DefaultEventsMap`, `DefaultEventsMap`, `DefaultEventsMap`, `any`\> |

#### Defined in

[packages/core/shared/src/spellManager/SpellRunner.ts:33](https://github.com/Oneirocom/Magick/blob/c560ff45/packages/core/shared/src/spellManager/SpellRunner.ts#L33)

## Properties

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

[packages/core/shared/src/spellManager/SpellRunner.ts:28](https://github.com/Oneirocom/Magick/blob/c560ff45/packages/core/shared/src/spellManager/SpellRunner.ts#L28)

___

### engine

• **engine**: [`MagickEngine`](../interfaces/MagickEngine.md)

#### Defined in

[packages/core/shared/src/spellManager/SpellRunner.ts:27](https://github.com/Oneirocom/Magick/blob/c560ff45/packages/core/shared/src/spellManager/SpellRunner.ts#L27)

___

### module

• **module**: `Module`

#### Defined in

[packages/core/shared/src/spellManager/SpellRunner.ts:29](https://github.com/Oneirocom/Magick/blob/c560ff45/packages/core/shared/src/spellManager/SpellRunner.ts#L29)

___

### ranSpells

• **ranSpells**: `string`[] = `[]`

#### Defined in

[packages/core/shared/src/spellManager/SpellRunner.ts:30](https://github.com/Oneirocom/Magick/blob/c560ff45/packages/core/shared/src/spellManager/SpellRunner.ts#L30)

___

### socket

• `Optional` **socket**: ``null`` \| `Socket`<`DefaultEventsMap`, `DefaultEventsMap`, `DefaultEventsMap`, `any`\> = `null`

#### Defined in

[packages/core/shared/src/spellManager/SpellRunner.ts:31](https://github.com/Oneirocom/Magick/blob/c560ff45/packages/core/shared/src/spellManager/SpellRunner.ts#L31)

## Accessors

### context

• `get` **context**(): `Object`

Getter method which returns the run context for the current spell.

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
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

#### Defined in

[packages/core/shared/src/spellManager/SpellRunner.ts:68](https://github.com/Oneirocom/Magick/blob/c560ff45/packages/core/shared/src/spellManager/SpellRunner.ts#L68)

___

### inputKeys

• `get` **inputKeys**(): `string`[]

#### Returns

`string`[]

#### Defined in

[packages/core/shared/src/spellManager/SpellRunner.ts:77](https://github.com/Oneirocom/Magick/blob/c560ff45/packages/core/shared/src/spellManager/SpellRunner.ts#L77)

___

### inputs

• `get` **inputs**(): `Map`<`string`, `Socket`\>

Getter method for the inputs for the loaded spell

#### Returns

`Map`<`string`, `Socket`\>

#### Defined in

[packages/core/shared/src/spellManager/SpellRunner.ts:61](https://github.com/Oneirocom/Magick/blob/c560ff45/packages/core/shared/src/spellManager/SpellRunner.ts#L61)

___

### outputData

• `get` **outputData**(): `Record`<`string`, `unknown`\>

Getter method to return a formatted set of outputs of the most recent spell run.

#### Returns

`Record`<`string`, `unknown`\>

#### Defined in

[packages/core/shared/src/spellManager/SpellRunner.ts:84](https://github.com/Oneirocom/Magick/blob/c560ff45/packages/core/shared/src/spellManager/SpellRunner.ts#L84)

___

### triggerIns

• `get` **triggerIns**(): `Map`<`string`, `Socket`\>

Getter method for the triggers ins for the loaded spell

#### Returns

`Map`<`string`, `Socket`\>

#### Defined in

[packages/core/shared/src/spellManager/SpellRunner.ts:54](https://github.com/Oneirocom/Magick/blob/c560ff45/packages/core/shared/src/spellManager/SpellRunner.ts#L54)

## Methods

### \_clearRanSpellCache

▸ `Private` **_clearRanSpellCache**(): `void`

Clears the cache of spells which the runner has ran.

#### Returns

`void`

#### Defined in

[packages/core/shared/src/spellManager/SpellRunner.ts:93](https://github.com/Oneirocom/Magick/blob/c560ff45/packages/core/shared/src/spellManager/SpellRunner.ts#L93)

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

[packages/core/shared/src/spellManager/SpellRunner.ts:103](https://github.com/Oneirocom/Magick/blob/c560ff45/packages/core/shared/src/spellManager/SpellRunner.ts#L103)

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

[packages/core/shared/src/spellManager/SpellRunner.ts:121](https://github.com/Oneirocom/Magick/blob/c560ff45/packages/core/shared/src/spellManager/SpellRunner.ts#L121)

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

[packages/core/shared/src/spellManager/SpellRunner.ts:113](https://github.com/Oneirocom/Magick/blob/c560ff45/packages/core/shared/src/spellManager/SpellRunner.ts#L113)

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

[packages/core/shared/src/spellManager/SpellRunner.ts:142](https://github.com/Oneirocom/Magick/blob/c560ff45/packages/core/shared/src/spellManager/SpellRunner.ts#L142)

___

### \_resetTasks

▸ `Private` **_resetTasks**(): `void`

Resets all tasks.  This clears the cached data output of the task and prepares
it for the next run.

#### Returns

`void`

#### Defined in

[packages/core/shared/src/spellManager/SpellRunner.ts:159](https://github.com/Oneirocom/Magick/blob/c560ff45/packages/core/shared/src/spellManager/SpellRunner.ts#L159)

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

[packages/core/shared/src/spellManager/SpellRunner.ts:178](https://github.com/Oneirocom/Magick/blob/c560ff45/packages/core/shared/src/spellManager/SpellRunner.ts#L178)

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

[packages/core/shared/src/spellManager/SpellRunner.ts:197](https://github.com/Oneirocom/Magick/blob/c560ff45/packages/core/shared/src/spellManager/SpellRunner.ts#L197)
