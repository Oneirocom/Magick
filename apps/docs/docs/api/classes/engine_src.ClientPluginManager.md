---
id: "engine_src.ClientPluginManager"
title: "Class: ClientPluginManager"
sidebar_label: "engine/src.ClientPluginManager"
custom_edit_url: null
---

[engine/src](../modules/engine_src.md).ClientPluginManager

## Hierarchy

- `PluginManager`

  ↳ **`ClientPluginManager`**

## Constructors

### constructor

• **new ClientPluginManager**()

#### Overrides

PluginManager.constructor

#### Defined in

[packages/engine/src/lib/plugin.ts:261](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/plugin.ts#L261)

## Properties

### componentList

• **componentList**: `Record`<`string`, `never`\>

#### Inherited from

PluginManager.componentList

#### Defined in

[packages/engine/src/lib/plugin.ts:183](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/plugin.ts#L183)

___

### pluginList

• **pluginList**: [`ClientPlugin`](engine_src.ClientPlugin.md)[]

#### Overrides

PluginManager.pluginList

#### Defined in

[packages/engine/src/lib/plugin.ts:260](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/plugin.ts#L260)

___

### plugins

• **plugins**: `any`

#### Inherited from

PluginManager.plugins

#### Defined in

[packages/engine/src/lib/plugin.ts:184](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/plugin.ts#L184)

## Methods

### getAgentComponents

▸ **getAgentComponents**(): `FC`<{}\>[]

#### Returns

`FC`<{}\>[]

#### Defined in

[packages/engine/src/lib/plugin.ts:266](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/plugin.ts#L266)

___

### getAgentStartMethods

▸ **getAgentStartMethods**(): `Record`<`string`, (`args`: `any`) => `void` \| `Promise`<`void`\>\>

#### Returns

`Record`<`string`, (`args`: `any`) => `void` \| `Promise`<`void`\>\>

#### Defined in

[packages/engine/src/lib/plugin.ts:376](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/plugin.ts#L376)

___

### getAgentStopMethods

▸ **getAgentStopMethods**(): `Record`<`string`, (`args`: `any`) => `void` \| `Promise`<`void`\>\>

#### Returns

`Record`<`string`, (`args`: `any`) => `void` \| `Promise`<`void`\>\>

#### Defined in

[packages/engine/src/lib/plugin.ts:380](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/plugin.ts#L380)

___

### getClientPageLayout

▸ **getClientPageLayout**(`p`): `undefined` \| [`PageLayout`](../modules/engine_src.md#pagelayout)

#### Parameters

| Name | Type |
| :------ | :------ |
| `p` | `any` |

#### Returns

`undefined` \| [`PageLayout`](../modules/engine_src.md#pagelayout)

#### Defined in

[packages/engine/src/lib/plugin.ts:339](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/plugin.ts#L339)

___

### getClientRoutes

▸ **getClientRoutes**(): [`PluginClientRoute`](../modules/engine_src.md#pluginclientroute)[]

#### Returns

[`PluginClientRoute`](../modules/engine_src.md#pluginclientroute)[]

#### Defined in

[packages/engine/src/lib/plugin.ts:297](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/plugin.ts#L297)

___

### getCompletionProviders

▸ **getCompletionProviders**(`type?`, `subtypes?`): [`CompletionProvider`](../modules/engine_src.md#completionprovider)[]

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `type` | ``null`` \| `string` | `null` |
| `subtypes` | ``null`` \| `string`[] | `null` |

#### Returns

[`CompletionProvider`](../modules/engine_src.md#completionprovider)[]

#### Inherited from

PluginManager.getCompletionProviders

#### Defined in

[packages/engine/src/lib/plugin.ts:243](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/plugin.ts#L243)

___

### getDrawerItems

▸ **getDrawerItems**(): [`PluginDrawerItem`](../modules/engine_src.md#plugindraweritem) & { `plugin`: `string`  }[]

#### Returns

[`PluginDrawerItem`](../modules/engine_src.md#plugindraweritem) & { `plugin`: `string`  }[]

#### Defined in

[packages/engine/src/lib/plugin.ts:347](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/plugin.ts#L347)

___

### getGroupedClientRoutes

▸ **getGroupedClientRoutes**(): { `layout`: [`PageLayout`](../modules/engine_src.md#pagelayout) ; `plugin`: `string` ; `routes`: [`PluginClientRoute`](../modules/engine_src.md#pluginclientroute)[]  }[]

#### Returns

{ `layout`: [`PageLayout`](../modules/engine_src.md#pagelayout) ; `plugin`: `string` ; `routes`: [`PluginClientRoute`](../modules/engine_src.md#pluginclientroute)[]  }[]

#### Defined in

[packages/engine/src/lib/plugin.ts:309](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/plugin.ts#L309)

___

### getInputByName

▸ **getInputByName**(): `Object`

#### Returns

`Object`

#### Defined in

[packages/engine/src/lib/plugin.ts:359](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/plugin.ts#L359)

___

### getInputTypes

▸ **getInputTypes**(): [`PluginIOType`](../modules/engine_src.md#pluginiotype)[]

#### Returns

[`PluginIOType`](../modules/engine_src.md#pluginiotype)[]

#### Inherited from

PluginManager.getInputTypes

#### Defined in

[packages/engine/src/lib/plugin.ts:194](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/plugin.ts#L194)

___

### getNodes

▸ **getNodes**(): `Object`

#### Returns

`Object`

#### Inherited from

PluginManager.getNodes

#### Defined in

[packages/engine/src/lib/plugin.ts:215](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/plugin.ts#L215)

___

### getOutputTypes

▸ **getOutputTypes**(): [`PluginIOType`](../modules/engine_src.md#pluginiotype)[]

#### Returns

[`PluginIOType`](../modules/engine_src.md#pluginiotype)[]

#### Inherited from

PluginManager.getOutputTypes

#### Defined in

[packages/engine/src/lib/plugin.ts:205](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/plugin.ts#L205)

___

### getPlugins

▸ **getPlugins**(): `Object`

#### Returns

`Object`

#### Defined in

[packages/engine/src/lib/plugin.ts:367](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/plugin.ts#L367)

___

### getProjectTemplates

▸ **getProjectTemplates**(): `any`[]

#### Returns

`any`[]

#### Defined in

[packages/engine/src/lib/plugin.ts:286](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/plugin.ts#L286)

___

### getSecrets

▸ **getSecrets**(`global?`): [`PluginSecret`](../modules/engine_src.md#pluginsecret)[]

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `global` | `boolean` | `false` |

#### Returns

[`PluginSecret`](../modules/engine_src.md#pluginsecret)[]

#### Inherited from

PluginManager.getSecrets

#### Defined in

[packages/engine/src/lib/plugin.ts:232](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/plugin.ts#L232)

___

### getServerInits

▸ **getServerInits**(): [`ServerInits`](../modules/engine_src.md#serverinits)

#### Returns

[`ServerInits`](../modules/engine_src.md#serverinits)

#### Defined in

[packages/engine/src/lib/plugin.ts:387](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/plugin.ts#L387)

___

### getServerRoutes

▸ **getServerRoutes**(): [`Route`](../modules/engine_src.md#route)[]

#### Returns

[`Route`](../modules/engine_src.md#route)[]

#### Defined in

[packages/engine/src/lib/plugin.ts:392](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/plugin.ts#L392)

___

### getServices

▸ **getServices**(): [`string`, (`app`: `Application`<`any`, `any`\>) => `void`][]

#### Returns

[`string`, (`app`: `Application`<`any`, `any`\>) => `void`][]

#### Defined in

[packages/engine/src/lib/plugin.ts:383](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/plugin.ts#L383)

___

### getSpellTemplates

▸ **getSpellTemplates**(): { `createdAt?`: `string` ; `graph`: { id: string; nodes: any; } ; `hash`: `string` ; `id`: `string` ; `name`: `string` ; `projectId`: `string` ; `updatedAt?`: `string`  }[]

#### Returns

{ `createdAt?`: `string` ; `graph`: { id: string; nodes: any; } ; `hash`: `string` ; `id`: `string` ; `name`: `string` ; `projectId`: `string` ; `updatedAt?`: `string`  }[]

#### Defined in

[packages/engine/src/lib/plugin.ts:276](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/plugin.ts#L276)

___

### register

▸ **register**(`plugin`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `plugin` | [`ClientPlugin`](engine_src.ClientPlugin.md) \| [`ServerPlugin`](engine_src.ServerPlugin.md) |

#### Returns

`void`

#### Inherited from

PluginManager.register

#### Defined in

[packages/engine/src/lib/plugin.ts:190](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/plugin.ts#L190)
