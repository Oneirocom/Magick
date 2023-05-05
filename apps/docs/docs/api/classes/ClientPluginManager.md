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

[packages/core/shared/src/plugin.ts:274](https://github.com/Oneirocom/Magick/blob/c560ff45/packages/core/shared/src/plugin.ts#L274)

## Properties

### componentList

• **componentList**: `Record`<`string`, `never`\>

#### Inherited from

PluginManager.componentList

#### Defined in

[packages/core/shared/src/plugin.ts:183](https://github.com/Oneirocom/Magick/blob/c560ff45/packages/core/shared/src/plugin.ts#L183)

___

### pluginList

• **pluginList**: [`ClientPlugin`](ClientPlugin.md)[]

#### Overrides

PluginManager.pluginList

#### Defined in

[packages/core/shared/src/plugin.ts:273](https://github.com/Oneirocom/Magick/blob/c560ff45/packages/core/shared/src/plugin.ts#L273)

___

### plugins

• **plugins**: `any`

#### Inherited from

PluginManager.plugins

#### Defined in

[packages/core/shared/src/plugin.ts:184](https://github.com/Oneirocom/Magick/blob/c560ff45/packages/core/shared/src/plugin.ts#L184)

## Methods

### getAgentComponents

▸ **getAgentComponents**(): `FC`<{}\>[]

#### Returns

`FC`<{}\>[]

#### Defined in

[packages/core/shared/src/plugin.ts:279](https://github.com/Oneirocom/Magick/blob/c560ff45/packages/core/shared/src/plugin.ts#L279)

___

### getAgentStartMethods

▸ **getAgentStartMethods**(): `Record`<`string`, (`args`: `any`) => `void` \| `Promise`<`void`\>\>

#### Returns

`Record`<`string`, (`args`: `any`) => `void` \| `Promise`<`void`\>\>

#### Defined in

[packages/core/shared/src/plugin.ts:389](https://github.com/Oneirocom/Magick/blob/c560ff45/packages/core/shared/src/plugin.ts#L389)

___

### getAgentStopMethods

▸ **getAgentStopMethods**(): `Record`<`string`, (`args`: `any`) => `void` \| `Promise`<`void`\>\>

#### Returns

`Record`<`string`, (`args`: `any`) => `void` \| `Promise`<`void`\>\>

#### Defined in

[packages/core/shared/src/plugin.ts:393](https://github.com/Oneirocom/Magick/blob/c560ff45/packages/core/shared/src/plugin.ts#L393)

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

[packages/core/shared/src/plugin.ts:352](https://github.com/Oneirocom/Magick/blob/c560ff45/packages/core/shared/src/plugin.ts#L352)

___

### getClientRoutes

▸ **getClientRoutes**(): [`PluginClientRoute`](../#pluginclientroute)[]

#### Returns

[`PluginClientRoute`](../#pluginclientroute)[]

#### Defined in

[packages/core/shared/src/plugin.ts:310](https://github.com/Oneirocom/Magick/blob/c560ff45/packages/core/shared/src/plugin.ts#L310)

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

[packages/core/shared/src/plugin.ts:239](https://github.com/Oneirocom/Magick/blob/c560ff45/packages/core/shared/src/plugin.ts#L239)

___

### getCompletionProvidersWithSecrets

▸ **getCompletionProvidersWithSecrets**(`type?`, `subtypes?`): `any`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `type` | ``null`` \| `string` | `null` |
| `subtypes` | ``null`` \| `string`[] | `null` |

#### Returns

`any`

#### Inherited from

PluginManager.getCompletionProvidersWithSecrets

#### Defined in

[packages/core/shared/src/plugin.ts:254](https://github.com/Oneirocom/Magick/blob/c560ff45/packages/core/shared/src/plugin.ts#L254)

___

### getDrawerItems

▸ **getDrawerItems**(): [`PluginDrawerItem`](../#plugindraweritem) & { `plugin`: `string`  }[]

#### Returns

[`PluginDrawerItem`](../#plugindraweritem) & { `plugin`: `string`  }[]

#### Defined in

[packages/core/shared/src/plugin.ts:360](https://github.com/Oneirocom/Magick/blob/c560ff45/packages/core/shared/src/plugin.ts#L360)

___

### getGroupedClientRoutes

▸ **getGroupedClientRoutes**(): { `layout`: [`PageLayout`](../#pagelayout) ; `plugin`: `string` ; `routes`: [`PluginClientRoute`](../#pluginclientroute)[]  }[]

#### Returns

{ `layout`: [`PageLayout`](../#pagelayout) ; `plugin`: `string` ; `routes`: [`PluginClientRoute`](../#pluginclientroute)[]  }[]

#### Defined in

[packages/core/shared/src/plugin.ts:322](https://github.com/Oneirocom/Magick/blob/c560ff45/packages/core/shared/src/plugin.ts#L322)

___

### getInputByName

▸ **getInputByName**(): `Object`

#### Returns

`Object`

#### Defined in

[packages/core/shared/src/plugin.ts:372](https://github.com/Oneirocom/Magick/blob/c560ff45/packages/core/shared/src/plugin.ts#L372)

___

### getInputTypes

▸ **getInputTypes**(): [`PluginIOType`](../#pluginiotype)[]

#### Returns

[`PluginIOType`](../#pluginiotype)[]

#### Inherited from

PluginManager.getInputTypes

#### Defined in

[packages/core/shared/src/plugin.ts:194](https://github.com/Oneirocom/Magick/blob/c560ff45/packages/core/shared/src/plugin.ts#L194)

___

### getNodes

▸ **getNodes**(): `Object`

#### Returns

`Object`

#### Inherited from

PluginManager.getNodes

#### Defined in

[packages/core/shared/src/plugin.ts:214](https://github.com/Oneirocom/Magick/blob/c560ff45/packages/core/shared/src/plugin.ts#L214)

___

### getOutputTypes

▸ **getOutputTypes**(): [`PluginIOType`](../#pluginiotype)[]

#### Returns

[`PluginIOType`](../#pluginiotype)[]

#### Inherited from

PluginManager.getOutputTypes

#### Defined in

[packages/core/shared/src/plugin.ts:204](https://github.com/Oneirocom/Magick/blob/c560ff45/packages/core/shared/src/plugin.ts#L204)

___

### getPlugins

▸ **getPlugins**(): `Object`

#### Returns

`Object`

#### Defined in

[packages/core/shared/src/plugin.ts:380](https://github.com/Oneirocom/Magick/blob/c560ff45/packages/core/shared/src/plugin.ts#L380)

___

### getProjectTemplates

▸ **getProjectTemplates**(): `any`[]

#### Returns

`any`[]

#### Defined in

[packages/core/shared/src/plugin.ts:299](https://github.com/Oneirocom/Magick/blob/c560ff45/packages/core/shared/src/plugin.ts#L299)

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

[packages/core/shared/src/plugin.ts:229](https://github.com/Oneirocom/Magick/blob/c560ff45/packages/core/shared/src/plugin.ts#L229)

___

### getServerInits

▸ **getServerInits**(): [`ServerInits`](../#serverinits)

#### Returns

[`ServerInits`](../#serverinits)

#### Defined in

[packages/core/shared/src/plugin.ts:400](https://github.com/Oneirocom/Magick/blob/c560ff45/packages/core/shared/src/plugin.ts#L400)

___

### getServerRoutes

▸ **getServerRoutes**(): [`Route`](../#route)[]

#### Returns

[`Route`](../#route)[]

#### Defined in

[packages/core/shared/src/plugin.ts:405](https://github.com/Oneirocom/Magick/blob/c560ff45/packages/core/shared/src/plugin.ts#L405)

___

### getServices

▸ **getServices**(): [`string`, (`app`: `any`) => `void`][]

#### Returns

[`string`, (`app`: `any`) => `void`][]

#### Defined in

[packages/core/shared/src/plugin.ts:396](https://github.com/Oneirocom/Magick/blob/c560ff45/packages/core/shared/src/plugin.ts#L396)

___

### getSpellTemplates

▸ **getSpellTemplates**(): { `createdAt?`: `string` ; `graph`: { nodes: any; id: string; } ; `hash`: `string` ; `id`: `string` ; `name`: `string` ; `projectId`: `string` ; `updatedAt?`: `string`  }[]

#### Returns

{ `createdAt?`: `string` ; `graph`: { nodes: any; id: string; } ; `hash`: `string` ; `id`: `string` ; `name`: `string` ; `projectId`: `string` ; `updatedAt?`: `string`  }[]

#### Defined in

[packages/core/shared/src/plugin.ts:289](https://github.com/Oneirocom/Magick/blob/c560ff45/packages/core/shared/src/plugin.ts#L289)

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

[packages/core/shared/src/plugin.ts:190](https://github.com/Oneirocom/Magick/blob/c560ff45/packages/core/shared/src/plugin.ts#L190)
