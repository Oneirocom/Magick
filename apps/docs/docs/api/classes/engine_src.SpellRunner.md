---
id: "engine_src.SpellRunner"
title: "Class: SpellRunner"
sidebar_label: "engine/src.SpellRunner"
custom_edit_url: null
---

[engine/src](../modules/engine_src.md).SpellRunner

## Constructors

### constructor

• **new SpellRunner**(`«destructured»`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | [`RunSpellConstructor`](../modules/engine_src.md#runspellconstructor) |

#### Defined in

[packages/engine/src/lib/spellManager/SpellRunner.ts:35](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/spellManager/SpellRunner.ts#L35)

## Properties

### currentSpell

• **currentSpell**: `Object`

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

#### Defined in

[packages/engine/src/lib/spellManager/SpellRunner.ts:29](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/spellManager/SpellRunner.ts#L29)

___

### engine

• **engine**: [`MagickEngine`](../interfaces/engine_src.MagickEngine.md)

#### Defined in

[packages/engine/src/lib/spellManager/SpellRunner.ts:28](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/spellManager/SpellRunner.ts#L28)

___

### magickInterface

• **magickInterface**: [`EngineContext`](../modules/engine_src.md#enginecontext)<`Record`<`string`, `unknown`\>\>

#### Defined in

[packages/engine/src/lib/spellManager/SpellRunner.ts:31](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/spellManager/SpellRunner.ts#L31)

___

### module

• **module**: `Module`

#### Defined in

[packages/engine/src/lib/spellManager/SpellRunner.ts:30](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/spellManager/SpellRunner.ts#L30)

___

### ranSpells

• **ranSpells**: `string`[] = `[]`

#### Defined in

[packages/engine/src/lib/spellManager/SpellRunner.ts:32](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/spellManager/SpellRunner.ts#L32)

___

### socket

• `Optional` **socket**: ``null`` \| `Socket`<`DefaultEventsMap`, `DefaultEventsMap`, `DefaultEventsMap`, `any`\> = `null`

#### Defined in

[packages/engine/src/lib/spellManager/SpellRunner.ts:33](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/spellManager/SpellRunner.ts#L33)

## Accessors

### context

• `get` **context**(): `Object`

Getter method which returns the run context for the current spell.

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `currentSpell` | { `createdAt?`: `string` ; `graph`: { id: string; nodes: any; } ; `hash`: `string` ; `id`: `string` ; `name`: `string` ; `projectId`: `string` ; `updatedAt?`: `string`  } |
| `currentSpell.createdAt?` | `string` |
| `currentSpell.graph` | { id: string; nodes: any; } |
| `currentSpell.hash` | `string` |
| `currentSpell.id` | `string` |
| `currentSpell.name` | `string` |
| `currentSpell.projectId` | `string` |
| `currentSpell.updatedAt?` | `string` |
| `magick` | [`EngineContext`](../modules/engine_src.md#enginecontext)<`Record`<`string`, `unknown`\>\> |
| `module` | `Module` |
| `projectId` | `string` |

#### Defined in

[packages/engine/src/lib/spellManager/SpellRunner.ts:73](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/spellManager/SpellRunner.ts#L73)

___

### inputKeys

• `get` **inputKeys**(): `string`[]

#### Returns

`string`[]

#### Defined in

[packages/engine/src/lib/spellManager/SpellRunner.ts:83](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/spellManager/SpellRunner.ts#L83)

___

### inputs

• `get` **inputs**(): `Map`<`string`, `Socket`\>

Getter method for the inputs for the loaded spell

#### Returns

`Map`<`string`, `Socket`\>

#### Defined in

[packages/engine/src/lib/spellManager/SpellRunner.ts:66](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/spellManager/SpellRunner.ts#L66)

___

### outputData

• `get` **outputData**(): `Record`<`string`, `unknown`\>

Getter method to return a formatted set of outputs of the most recent spell run.

#### Returns

`Record`<`string`, `unknown`\>

#### Defined in

[packages/engine/src/lib/spellManager/SpellRunner.ts:90](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/spellManager/SpellRunner.ts#L90)

___

### triggerIns

• `get` **triggerIns**(): `Map`<`string`, `Socket`\>

Getter method for the triggers ins for the loaded spell

#### Returns

`Map`<`string`, `Socket`\>

#### Defined in

[packages/engine/src/lib/spellManager/SpellRunner.ts:59](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/spellManager/SpellRunner.ts#L59)

## Methods

### \_clearRanSpellCache

▸ `Private` **_clearRanSpellCache**(): `void`

Clears the cache of spells which the runner has ran.

#### Returns

`void`

#### Defined in

[packages/engine/src/lib/spellManager/SpellRunner.ts:99](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/spellManager/SpellRunner.ts#L99)

___

### \_formatInputs

▸ `Private` **_formatInputs**(`inputs`): `Record`<`string`, `unknown`[]\>

Used to format inputs into the format the moduel runner expects.
Takes a normal object of type { key: value } and returns an object
of shape { key: [value]}.  This shape isa required when running the spell
since that is the shape that rete inputs take when processing the graph.

#### Parameters

| Name | Type |
| :------ | :------ |
| `inputs` | `any` |

#### Returns

`Record`<`string`, `unknown`[]\>

#### Defined in

[packages/engine/src/lib/spellManager/SpellRunner.ts:109](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/spellManager/SpellRunner.ts#L109)

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

[packages/engine/src/lib/spellManager/SpellRunner.ts:127](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/spellManager/SpellRunner.ts#L127)

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

[packages/engine/src/lib/spellManager/SpellRunner.ts:119](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/spellManager/SpellRunner.ts#L119)

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

[packages/engine/src/lib/spellManager/SpellRunner.ts:148](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/spellManager/SpellRunner.ts#L148)

___

### \_resetTasks

▸ `Private` **_resetTasks**(): `void`

Resets all tasks.  This clears the cached data output of the task and prepares
it for the next run.

#### Returns

`void`

#### Defined in

[packages/engine/src/lib/spellManager/SpellRunner.ts:165](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/spellManager/SpellRunner.ts#L165)

___

### loadSpell

▸ **loadSpell**(`spell`): `Promise`<`void`\>

Loads a spell into the spell runner.

#### Parameters

| Name | Type |
| :------ | :------ |
| `spell` | `Object` |
| `spell.createdAt?` | `string` |
| `spell.graph` | { id: string; nodes: any; } |
| `spell.hash` | `string` |
| `spell.id` | `string` |
| `spell.name` | `string` |
| `spell.projectId` | `string` |
| `spell.updatedAt?` | `string` |

#### Returns

`Promise`<`void`\>

#### Defined in

[packages/engine/src/lib/spellManager/SpellRunner.ts:184](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/spellManager/SpellRunner.ts#L184)

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

[packages/engine/src/lib/spellManager/SpellRunner.ts:203](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/spellManager/SpellRunner.ts#L203)
