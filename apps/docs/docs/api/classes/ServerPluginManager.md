---
id: "ServerPluginManager"
title: "Class: ServerPluginManager"
sidebar_label: "ServerPluginManager"
sidebar_position: 0
custom_edit_url: null
---

## Hierarchy

- `PluginManager`

  ↳ **`ServerPluginManager`**

## Constructors

### constructor

• **new ServerPluginManager**()

#### Overrides

PluginManager.constructor

#### Defined in

[packages/core/shared/src/plugin.ts:413](https://github.com/Oneirocom/Magick/blob/c560ff45/packages/core/shared/src/plugin.ts#L413)

## Properties

### componentList

• **componentList**: `Record`<`string`, `never`\>

#### Inherited from

PluginManager.componentList

#### Defined in

[packages/core/shared/src/plugin.ts:183](https://github.com/Oneirocom/Magick/blob/c560ff45/packages/core/shared/src/plugin.ts#L183)

___

### pluginList

• **pluginList**: [`ServerPlugin`](ServerPlugin.md)[]

#### Overrides

PluginManager.pluginList

#### Defined in

[packages/core/shared/src/plugin.ts:412](https://github.com/Oneirocom/Magick/blob/c560ff45/packages/core/shared/src/plugin.ts#L412)

___

### plugins

• **plugins**: `any`

#### Inherited from

PluginManager.plugins

#### Defined in

[packages/core/shared/src/plugin.ts:184](https://github.com/Oneirocom/Magick/blob/c560ff45/packages/core/shared/src/plugin.ts#L184)

## Methods

### getAgentStartMethods

▸ **getAgentStartMethods**(): `Record`<`string`, (`args`: `any`) => `void` \| `Promise`<`void`\>\>

#### Returns

`Record`<`string`, (`args`: `any`) => `void` \| `Promise`<`void`\>\>

#### Defined in

[packages/core/shared/src/plugin.ts:418](https://github.com/Oneirocom/Magick/blob/c560ff45/packages/core/shared/src/plugin.ts#L418)

___

### getAgentStopMethods

▸ **getAgentStopMethods**(): `Record`<`string`, (`args`: `any`) => `void` \| `Promise`<`void`\>\>

#### Returns

`Record`<`string`, (`args`: `any`) => `void` \| `Promise`<`void`\>\>

#### Defined in

[packages/core/shared/src/plugin.ts:432](https://github.com/Oneirocom/Magick/blob/c560ff45/packages/core/shared/src/plugin.ts#L432)

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

[packages/core/shared/src/plugin.ts:456](https://github.com/Oneirocom/Magick/blob/c560ff45/packages/core/shared/src/plugin.ts#L456)

___

### getServerRoutes

▸ **getServerRoutes**(): [`Route`](../#route)[]

#### Returns

[`Route`](../#route)[]

#### Defined in

[packages/core/shared/src/plugin.ts:468](https://github.com/Oneirocom/Magick/blob/c560ff45/packages/core/shared/src/plugin.ts#L468)

___

### getServices

▸ **getServices**(): [`string`, (`app`: `any`) => `void`][]

#### Returns

[`string`, (`app`: `any`) => `void`][]

#### Defined in

[packages/core/shared/src/plugin.ts:446](https://github.com/Oneirocom/Magick/blob/c560ff45/packages/core/shared/src/plugin.ts#L446)

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
