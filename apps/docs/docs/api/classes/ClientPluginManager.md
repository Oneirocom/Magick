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

[packages/core/shared/src/plugin.ts:270](https://github.com/Oneirocom/Magick/blob/0b84928f/packages/core/shared/src/plugin.ts#L270)

## Properties

### componentList

• **componentList**: `Record`<`string`, `never`\>

#### Inherited from

PluginManager.componentList

#### Defined in

[packages/core/shared/src/plugin.ts:179](https://github.com/Oneirocom/Magick/blob/0b84928f/packages/core/shared/src/plugin.ts#L179)

___

### pluginList

• **pluginList**: [`ClientPlugin`](ClientPlugin.md)[]

#### Overrides

PluginManager.pluginList

#### Defined in

[packages/core/shared/src/plugin.ts:269](https://github.com/Oneirocom/Magick/blob/0b84928f/packages/core/shared/src/plugin.ts#L269)

___

### plugins

• **plugins**: `any`

#### Inherited from

PluginManager.plugins

#### Defined in

[packages/core/shared/src/plugin.ts:180](https://github.com/Oneirocom/Magick/blob/0b84928f/packages/core/shared/src/plugin.ts#L180)

## Methods

### getAgentComponents

▸ **getAgentComponents**(): `FC`<{}\>[]

#### Returns

`FC`<{}\>[]

#### Defined in

[packages/core/shared/src/plugin.ts:275](https://github.com/Oneirocom/Magick/blob/0b84928f/packages/core/shared/src/plugin.ts#L275)

___

### getAgentStartMethods

▸ **getAgentStartMethods**(): `Record`<`string`, (`args`: `any`) => `void` \| `Promise`<`void`\>\>

#### Returns

`Record`<`string`, (`args`: `any`) => `void` \| `Promise`<`void`\>\>

#### Defined in

[packages/core/shared/src/plugin.ts:383](https://github.com/Oneirocom/Magick/blob/0b84928f/packages/core/shared/src/plugin.ts#L383)

___

### getAgentStopMethods

▸ **getAgentStopMethods**(): `Record`<`string`, (`args`: `any`) => `void` \| `Promise`<`void`\>\>

#### Returns

`Record`<`string`, (`args`: `any`) => `void` \| `Promise`<`void`\>\>

#### Defined in

[packages/core/shared/src/plugin.ts:386](https://github.com/Oneirocom/Magick/blob/0b84928f/packages/core/shared/src/plugin.ts#L386)

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

[packages/core/shared/src/plugin.ts:347](https://github.com/Oneirocom/Magick/blob/0b84928f/packages/core/shared/src/plugin.ts#L347)

___

### getClientRoutes

▸ **getClientRoutes**(): [`PluginClientRoute`](../#pluginclientroute)[]

#### Returns

[`PluginClientRoute`](../#pluginclientroute)[]

#### Defined in

[packages/core/shared/src/plugin.ts:305](https://github.com/Oneirocom/Magick/blob/0b84928f/packages/core/shared/src/plugin.ts#L305)

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

[packages/core/shared/src/plugin.ts:235](https://github.com/Oneirocom/Magick/blob/0b84928f/packages/core/shared/src/plugin.ts#L235)

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

[packages/core/shared/src/plugin.ts:250](https://github.com/Oneirocom/Magick/blob/0b84928f/packages/core/shared/src/plugin.ts#L250)

___

### getDrawerItems

▸ **getDrawerItems**(): [`PluginDrawerItem`](../#plugindraweritem) & { `plugin`: `string`  }[]

#### Returns

[`PluginDrawerItem`](../#plugindraweritem) & { `plugin`: `string`  }[]

#### Defined in

[packages/core/shared/src/plugin.ts:355](https://github.com/Oneirocom/Magick/blob/0b84928f/packages/core/shared/src/plugin.ts#L355)

___

### getGroupedClientRoutes

▸ **getGroupedClientRoutes**(): { `layout`: [`PageLayout`](../#pagelayout) ; `plugin`: `string` ; `routes`: [`PluginClientRoute`](../#pluginclientroute)[]  }[]

#### Returns

{ `layout`: [`PageLayout`](../#pagelayout) ; `plugin`: `string` ; `routes`: [`PluginClientRoute`](../#pluginclientroute)[]  }[]

#### Defined in

[packages/core/shared/src/plugin.ts:317](https://github.com/Oneirocom/Magick/blob/0b84928f/packages/core/shared/src/plugin.ts#L317)

___

### getInputByName

▸ **getInputByName**(): `Object`

#### Returns

`Object`

#### Defined in

[packages/core/shared/src/plugin.ts:367](https://github.com/Oneirocom/Magick/blob/0b84928f/packages/core/shared/src/plugin.ts#L367)

___

### getInputTypes

▸ **getInputTypes**(): [`PluginIOType`](../#pluginiotype)[]

#### Returns

[`PluginIOType`](../#pluginiotype)[]

#### Inherited from

PluginManager.getInputTypes

#### Defined in

[packages/core/shared/src/plugin.ts:190](https://github.com/Oneirocom/Magick/blob/0b84928f/packages/core/shared/src/plugin.ts#L190)

___

### getNodes

▸ **getNodes**(): `Object`

#### Returns

`Object`

#### Inherited from

PluginManager.getNodes

#### Defined in

[packages/core/shared/src/plugin.ts:210](https://github.com/Oneirocom/Magick/blob/0b84928f/packages/core/shared/src/plugin.ts#L210)

___

### getOutputTypes

▸ **getOutputTypes**(): [`PluginIOType`](../#pluginiotype)[]

#### Returns

[`PluginIOType`](../#pluginiotype)[]

#### Inherited from

PluginManager.getOutputTypes

#### Defined in

[packages/core/shared/src/plugin.ts:200](https://github.com/Oneirocom/Magick/blob/0b84928f/packages/core/shared/src/plugin.ts#L200)

___

### getPlugins

▸ **getPlugins**(): `Object`

#### Returns

`Object`

#### Defined in

[packages/core/shared/src/plugin.ts:375](https://github.com/Oneirocom/Magick/blob/0b84928f/packages/core/shared/src/plugin.ts#L375)

___

### getProjectTemplates

▸ **getProjectTemplates**(): `any`[]

#### Returns

`any`[]

#### Defined in

[packages/core/shared/src/plugin.ts:295](https://github.com/Oneirocom/Magick/blob/0b84928f/packages/core/shared/src/plugin.ts#L295)

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

[packages/core/shared/src/plugin.ts:225](https://github.com/Oneirocom/Magick/blob/0b84928f/packages/core/shared/src/plugin.ts#L225)

___

### getServerInits

▸ **getServerInits**(): [`ServerInits`](../#serverinits)

#### Returns

[`ServerInits`](../#serverinits)

#### Defined in

[packages/core/shared/src/plugin.ts:393](https://github.com/Oneirocom/Magick/blob/0b84928f/packages/core/shared/src/plugin.ts#L393)

___

### getServerRoutes

▸ **getServerRoutes**(): [`Route`](../#route)[]

#### Returns

[`Route`](../#route)[]

#### Defined in

[packages/core/shared/src/plugin.ts:398](https://github.com/Oneirocom/Magick/blob/0b84928f/packages/core/shared/src/plugin.ts#L398)

___

### getServices

▸ **getServices**(): [`string`, (`app`: `any`) => `void`][]

#### Returns

[`string`, (`app`: `any`) => `void`][]

#### Defined in

[packages/core/shared/src/plugin.ts:389](https://github.com/Oneirocom/Magick/blob/0b84928f/packages/core/shared/src/plugin.ts#L389)

___

### getSpellTemplates

▸ **getSpellTemplates**(): { `createdAt?`: `string` ; `graph`: { nodes: any; id: string; } ; `hash`: `string` ; `id`: `string` ; `name`: `string` ; `projectId`: `string` ; `updatedAt?`: `string`  }[]

#### Returns

{ `createdAt?`: `string` ; `graph`: { nodes: any; id: string; } ; `hash`: `string` ; `id`: `string` ; `name`: `string` ; `projectId`: `string` ; `updatedAt?`: `string`  }[]

#### Defined in

[packages/core/shared/src/plugin.ts:285](https://github.com/Oneirocom/Magick/blob/0b84928f/packages/core/shared/src/plugin.ts#L285)

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

[packages/core/shared/src/plugin.ts:186](https://github.com/Oneirocom/Magick/blob/0b84928f/packages/core/shared/src/plugin.ts#L186)
