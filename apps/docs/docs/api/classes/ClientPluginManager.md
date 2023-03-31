---
id: "ClientPluginManager"
title: "Class: ClientPluginManager"
sidebar_label: "ClientPluginManager"
sidebar_position: 0
custom_edit_url: null
---

## Hierarchy

- `PluginManager`

  ↳ **`ClientPluginManager`**

## Constructors

### constructor

• **new ClientPluginManager**()

#### Overrides

PluginManager.constructor

#### Defined in

[packages/engine/src/lib/plugin.ts:261](https://github.com/Oneirocom/MagickML/blob/7e703a94/packages/engine/src/lib/plugin.ts#L261)

## Properties

### componentList

• **componentList**: `Record`<`string`, `never`\>

#### Inherited from

PluginManager.componentList

#### Defined in

[packages/engine/src/lib/plugin.ts:183](https://github.com/Oneirocom/MagickML/blob/7e703a94/packages/engine/src/lib/plugin.ts#L183)

___

### pluginList

• **pluginList**: [`ClientPlugin`](ClientPlugin.md)[]

#### Overrides

PluginManager.pluginList

#### Defined in

[packages/engine/src/lib/plugin.ts:260](https://github.com/Oneirocom/MagickML/blob/7e703a94/packages/engine/src/lib/plugin.ts#L260)

___

### plugins

• **plugins**: `any`

#### Inherited from

PluginManager.plugins

#### Defined in

[packages/engine/src/lib/plugin.ts:184](https://github.com/Oneirocom/MagickML/blob/7e703a94/packages/engine/src/lib/plugin.ts#L184)

## Methods

### getAgentComponents

▸ **getAgentComponents**(): `FC`<{}\>[]

#### Returns

`FC`<{}\>[]

#### Defined in

[packages/engine/src/lib/plugin.ts:266](https://github.com/Oneirocom/MagickML/blob/7e703a94/packages/engine/src/lib/plugin.ts#L266)

___

### getAgentStartMethods

▸ **getAgentStartMethods**(): `Record`<`string`, (`args`: `any`) => `void` \| `Promise`<`void`\>\>

#### Returns

`Record`<`string`, (`args`: `any`) => `void` \| `Promise`<`void`\>\>

#### Defined in

[packages/engine/src/lib/plugin.ts:376](https://github.com/Oneirocom/MagickML/blob/7e703a94/packages/engine/src/lib/plugin.ts#L376)

___

### getAgentStopMethods

▸ **getAgentStopMethods**(): `Record`<`string`, (`args`: `any`) => `void` \| `Promise`<`void`\>\>

#### Returns

`Record`<`string`, (`args`: `any`) => `void` \| `Promise`<`void`\>\>

#### Defined in

[packages/engine/src/lib/plugin.ts:380](https://github.com/Oneirocom/MagickML/blob/7e703a94/packages/engine/src/lib/plugin.ts#L380)

___

### getClientPageLayout

▸ **getClientPageLayout**(`p`): `undefined` \| [`PageLayout`](../#pagelayout)

#### Parameters

| Name | Type |
| :------ | :------ |
| `p` | `any` |

#### Returns

`undefined` \| [`PageLayout`](../#pagelayout)

#### Defined in

[packages/engine/src/lib/plugin.ts:339](https://github.com/Oneirocom/MagickML/blob/7e703a94/packages/engine/src/lib/plugin.ts#L339)

___

### getClientRoutes

▸ **getClientRoutes**(): [`PluginClientRoute`](../#pluginclientroute)[]

#### Returns

[`PluginClientRoute`](../#pluginclientroute)[]

#### Defined in

[packages/engine/src/lib/plugin.ts:297](https://github.com/Oneirocom/MagickML/blob/7e703a94/packages/engine/src/lib/plugin.ts#L297)

___

### getCompletionProviders

▸ **getCompletionProviders**(`type?`, `subtypes?`): [`CompletionProvider`](../#completionprovider)[]

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `type` | ``null`` \| `string` | `null` |
| `subtypes` | ``null`` \| `string`[] | `null` |

#### Returns

[`CompletionProvider`](../#completionprovider)[]

#### Inherited from

PluginManager.getCompletionProviders

#### Defined in

[packages/engine/src/lib/plugin.ts:243](https://github.com/Oneirocom/MagickML/blob/7e703a94/packages/engine/src/lib/plugin.ts#L243)

___

### getDrawerItems

▸ **getDrawerItems**(): [`PluginDrawerItem`](../#plugindraweritem) & { `plugin`: `string`  }[]

#### Returns

[`PluginDrawerItem`](../#plugindraweritem) & { `plugin`: `string`  }[]

#### Defined in

[packages/engine/src/lib/plugin.ts:347](https://github.com/Oneirocom/MagickML/blob/7e703a94/packages/engine/src/lib/plugin.ts#L347)

___

### getGroupedClientRoutes

▸ **getGroupedClientRoutes**(): { `layout`: [`PageLayout`](../#pagelayout) ; `plugin`: `string` ; `routes`: [`PluginClientRoute`](../#pluginclientroute)[]  }[]

#### Returns

{ `layout`: [`PageLayout`](../#pagelayout) ; `plugin`: `string` ; `routes`: [`PluginClientRoute`](../#pluginclientroute)[]  }[]

#### Defined in

[packages/engine/src/lib/plugin.ts:309](https://github.com/Oneirocom/MagickML/blob/7e703a94/packages/engine/src/lib/plugin.ts#L309)

___

### getInputByName

▸ **getInputByName**(): `Object`

#### Returns

`Object`

#### Defined in

[packages/engine/src/lib/plugin.ts:359](https://github.com/Oneirocom/MagickML/blob/7e703a94/packages/engine/src/lib/plugin.ts#L359)

___

### getInputTypes

▸ **getInputTypes**(): [`PluginIOType`](../#pluginiotype)[]

#### Returns

[`PluginIOType`](../#pluginiotype)[]

#### Inherited from

PluginManager.getInputTypes

#### Defined in

[packages/engine/src/lib/plugin.ts:194](https://github.com/Oneirocom/MagickML/blob/7e703a94/packages/engine/src/lib/plugin.ts#L194)

___

### getNodes

▸ **getNodes**(): `Object`

#### Returns

`Object`

#### Inherited from

PluginManager.getNodes

#### Defined in

[packages/engine/src/lib/plugin.ts:215](https://github.com/Oneirocom/MagickML/blob/7e703a94/packages/engine/src/lib/plugin.ts#L215)

___

### getOutputTypes

▸ **getOutputTypes**(): [`PluginIOType`](../#pluginiotype)[]

#### Returns

[`PluginIOType`](../#pluginiotype)[]

#### Inherited from

PluginManager.getOutputTypes

#### Defined in

[packages/engine/src/lib/plugin.ts:205](https://github.com/Oneirocom/MagickML/blob/7e703a94/packages/engine/src/lib/plugin.ts#L205)

___

### getPlugins

▸ **getPlugins**(): `Object`

#### Returns

`Object`

#### Defined in

[packages/engine/src/lib/plugin.ts:367](https://github.com/Oneirocom/MagickML/blob/7e703a94/packages/engine/src/lib/plugin.ts#L367)

___

### getProjectTemplates

▸ **getProjectTemplates**(): `any`[]

#### Returns

`any`[]

#### Defined in

[packages/engine/src/lib/plugin.ts:286](https://github.com/Oneirocom/MagickML/blob/7e703a94/packages/engine/src/lib/plugin.ts#L286)

___

### getSecrets

▸ **getSecrets**(`global?`): [`PluginSecret`](../#pluginsecret)[]

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `global` | `boolean` | `false` |

#### Returns

[`PluginSecret`](../#pluginsecret)[]

#### Inherited from

PluginManager.getSecrets

#### Defined in

[packages/engine/src/lib/plugin.ts:232](https://github.com/Oneirocom/MagickML/blob/7e703a94/packages/engine/src/lib/plugin.ts#L232)

___

### getServerInits

▸ **getServerInits**(): [`ServerInits`](../#serverinits)

#### Returns

[`ServerInits`](../#serverinits)

#### Defined in

[packages/engine/src/lib/plugin.ts:387](https://github.com/Oneirocom/MagickML/blob/7e703a94/packages/engine/src/lib/plugin.ts#L387)

___

### getServerRoutes

▸ **getServerRoutes**(): [`Route`](../#route)[]

#### Returns

[`Route`](../#route)[]

#### Defined in

[packages/engine/src/lib/plugin.ts:392](https://github.com/Oneirocom/MagickML/blob/7e703a94/packages/engine/src/lib/plugin.ts#L392)

___

### getServices

▸ **getServices**(): [`string`, (`app`: `Application`<`any`, `any`\>) => `void`][]

#### Returns

[`string`, (`app`: `Application`<`any`, `any`\>) => `void`][]

#### Defined in

[packages/engine/src/lib/plugin.ts:383](https://github.com/Oneirocom/MagickML/blob/7e703a94/packages/engine/src/lib/plugin.ts#L383)

___

### getSpellTemplates

▸ **getSpellTemplates**(): { `createdAt?`: `string` ; `graph`: { id: string; nodes: any; } ; `hash`: `string` ; `id`: `string` ; `name`: `string` ; `projectId`: `string` ; `updatedAt?`: `string`  }[]

#### Returns

{ `createdAt?`: `string` ; `graph`: { id: string; nodes: any; } ; `hash`: `string` ; `id`: `string` ; `name`: `string` ; `projectId`: `string` ; `updatedAt?`: `string`  }[]

#### Defined in

[packages/engine/src/lib/plugin.ts:276](https://github.com/Oneirocom/MagickML/blob/7e703a94/packages/engine/src/lib/plugin.ts#L276)

___

### register

▸ **register**(`plugin`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `plugin` | [`ClientPlugin`](ClientPlugin.md) \| [`ServerPlugin`](ServerPlugin.md) |

#### Returns

`void`

#### Inherited from

PluginManager.register

#### Defined in

[packages/engine/src/lib/plugin.ts:190](https://github.com/Oneirocom/MagickML/blob/7e703a94/packages/engine/src/lib/plugin.ts#L190)
