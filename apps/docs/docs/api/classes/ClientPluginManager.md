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

[packages/engine/src/lib/plugin.ts:260](https://github.com/Oneirocom/MagickML/blob/f4db6e49/packages/engine/src/lib/plugin.ts#L260)

## Properties

### componentList

• **componentList**: `Record`<`string`, `never`\>

#### Inherited from

PluginManager.componentList

#### Defined in

[packages/engine/src/lib/plugin.ts:182](https://github.com/Oneirocom/MagickML/blob/f4db6e49/packages/engine/src/lib/plugin.ts#L182)

___

### pluginList

• **pluginList**: [`ClientPlugin`](ClientPlugin.md)[]

#### Overrides

PluginManager.pluginList

#### Defined in

[packages/engine/src/lib/plugin.ts:259](https://github.com/Oneirocom/MagickML/blob/f4db6e49/packages/engine/src/lib/plugin.ts#L259)

___

### plugins

• **plugins**: `any`

#### Inherited from

PluginManager.plugins

#### Defined in

[packages/engine/src/lib/plugin.ts:183](https://github.com/Oneirocom/MagickML/blob/f4db6e49/packages/engine/src/lib/plugin.ts#L183)

## Methods

### getAgentComponents

▸ **getAgentComponents**(): `FC`<{}\>[]

#### Returns

`FC`<{}\>[]

#### Defined in

[packages/engine/src/lib/plugin.ts:265](https://github.com/Oneirocom/MagickML/blob/f4db6e49/packages/engine/src/lib/plugin.ts#L265)

___

### getAgentStartMethods

▸ **getAgentStartMethods**(): `Record`<`string`, (`args`: `any`) => `void` \| `Promise`<`void`\>\>

#### Returns

`Record`<`string`, (`args`: `any`) => `void` \| `Promise`<`void`\>\>

#### Defined in

[packages/engine/src/lib/plugin.ts:375](https://github.com/Oneirocom/MagickML/blob/f4db6e49/packages/engine/src/lib/plugin.ts#L375)

___

### getAgentStopMethods

▸ **getAgentStopMethods**(): `Record`<`string`, (`args`: `any`) => `void` \| `Promise`<`void`\>\>

#### Returns

`Record`<`string`, (`args`: `any`) => `void` \| `Promise`<`void`\>\>

#### Defined in

[packages/engine/src/lib/plugin.ts:379](https://github.com/Oneirocom/MagickML/blob/f4db6e49/packages/engine/src/lib/plugin.ts#L379)

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

[packages/engine/src/lib/plugin.ts:338](https://github.com/Oneirocom/MagickML/blob/f4db6e49/packages/engine/src/lib/plugin.ts#L338)

___

### getClientRoutes

▸ **getClientRoutes**(): [`PluginClientRoute`](../#pluginclientroute)[]

#### Returns

[`PluginClientRoute`](../#pluginclientroute)[]

#### Defined in

[packages/engine/src/lib/plugin.ts:296](https://github.com/Oneirocom/MagickML/blob/f4db6e49/packages/engine/src/lib/plugin.ts#L296)

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

[packages/engine/src/lib/plugin.ts:242](https://github.com/Oneirocom/MagickML/blob/f4db6e49/packages/engine/src/lib/plugin.ts#L242)

___

### getDrawerItems

▸ **getDrawerItems**(): [`PluginDrawerItem`](../#plugindraweritem) & { `plugin`: `string`  }[]

#### Returns

[`PluginDrawerItem`](../#plugindraweritem) & { `plugin`: `string`  }[]

#### Defined in

[packages/engine/src/lib/plugin.ts:346](https://github.com/Oneirocom/MagickML/blob/f4db6e49/packages/engine/src/lib/plugin.ts#L346)

___

### getGroupedClientRoutes

▸ **getGroupedClientRoutes**(): { `layout`: [`PageLayout`](../#pagelayout) ; `plugin`: `string` ; `routes`: [`PluginClientRoute`](../#pluginclientroute)[]  }[]

#### Returns

{ `layout`: [`PageLayout`](../#pagelayout) ; `plugin`: `string` ; `routes`: [`PluginClientRoute`](../#pluginclientroute)[]  }[]

#### Defined in

[packages/engine/src/lib/plugin.ts:308](https://github.com/Oneirocom/MagickML/blob/f4db6e49/packages/engine/src/lib/plugin.ts#L308)

___

### getInputByName

▸ **getInputByName**(): `Object`

#### Returns

`Object`

#### Defined in

[packages/engine/src/lib/plugin.ts:358](https://github.com/Oneirocom/MagickML/blob/f4db6e49/packages/engine/src/lib/plugin.ts#L358)

___

### getInputTypes

▸ **getInputTypes**(): [`PluginIOType`](../#pluginiotype)[]

#### Returns

[`PluginIOType`](../#pluginiotype)[]

#### Inherited from

PluginManager.getInputTypes

#### Defined in

[packages/engine/src/lib/plugin.ts:193](https://github.com/Oneirocom/MagickML/blob/f4db6e49/packages/engine/src/lib/plugin.ts#L193)

___

### getNodes

▸ **getNodes**(): `Object`

#### Returns

`Object`

#### Inherited from

PluginManager.getNodes

#### Defined in

[packages/engine/src/lib/plugin.ts:214](https://github.com/Oneirocom/MagickML/blob/f4db6e49/packages/engine/src/lib/plugin.ts#L214)

___

### getOutputTypes

▸ **getOutputTypes**(): [`PluginIOType`](../#pluginiotype)[]

#### Returns

[`PluginIOType`](../#pluginiotype)[]

#### Inherited from

PluginManager.getOutputTypes

#### Defined in

[packages/engine/src/lib/plugin.ts:204](https://github.com/Oneirocom/MagickML/blob/f4db6e49/packages/engine/src/lib/plugin.ts#L204)

___

### getPlugins

▸ **getPlugins**(): `Object`

#### Returns

`Object`

#### Defined in

[packages/engine/src/lib/plugin.ts:366](https://github.com/Oneirocom/MagickML/blob/f4db6e49/packages/engine/src/lib/plugin.ts#L366)

___

### getProjectTemplates

▸ **getProjectTemplates**(): `any`[]

#### Returns

`any`[]

#### Defined in

[packages/engine/src/lib/plugin.ts:285](https://github.com/Oneirocom/MagickML/blob/f4db6e49/packages/engine/src/lib/plugin.ts#L285)

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

[packages/engine/src/lib/plugin.ts:231](https://github.com/Oneirocom/MagickML/blob/f4db6e49/packages/engine/src/lib/plugin.ts#L231)

___

### getServerInits

▸ **getServerInits**(): [`ServerInits`](../#serverinits)

#### Returns

[`ServerInits`](../#serverinits)

#### Defined in

[packages/engine/src/lib/plugin.ts:386](https://github.com/Oneirocom/MagickML/blob/f4db6e49/packages/engine/src/lib/plugin.ts#L386)

___

### getServerRoutes

▸ **getServerRoutes**(): [`Route`](../#route)[]

#### Returns

[`Route`](../#route)[]

#### Defined in

[packages/engine/src/lib/plugin.ts:391](https://github.com/Oneirocom/MagickML/blob/f4db6e49/packages/engine/src/lib/plugin.ts#L391)

___

### getServices

▸ **getServices**(): [`string`, (`app`: `any`) => `void`][]

#### Returns

[`string`, (`app`: `any`) => `void`][]

#### Defined in

[packages/engine/src/lib/plugin.ts:382](https://github.com/Oneirocom/MagickML/blob/f4db6e49/packages/engine/src/lib/plugin.ts#L382)

___

### getSpellTemplates

▸ **getSpellTemplates**(): { `createdAt?`: `string` ; `graph`: { id: string; nodes: any; } ; `hash`: `string` ; `id`: `string` ; `name`: `string` ; `projectId`: `string` ; `updatedAt?`: `string`  }[]

#### Returns

{ `createdAt?`: `string` ; `graph`: { id: string; nodes: any; } ; `hash`: `string` ; `id`: `string` ; `name`: `string` ; `projectId`: `string` ; `updatedAt?`: `string`  }[]

#### Defined in

[packages/engine/src/lib/plugin.ts:275](https://github.com/Oneirocom/MagickML/blob/f4db6e49/packages/engine/src/lib/plugin.ts#L275)

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

[packages/engine/src/lib/plugin.ts:189](https://github.com/Oneirocom/MagickML/blob/f4db6e49/packages/engine/src/lib/plugin.ts#L189)
