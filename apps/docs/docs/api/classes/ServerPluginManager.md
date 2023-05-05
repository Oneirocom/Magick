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

[packages/core/shared/src/plugin.ts:406](https://github.com/Oneirocom/Magick/blob/eb9f05ef/packages/core/shared/src/plugin.ts#L406)

## Properties

### componentList

• **componentList**: `Record`<`string`, `never`\>

#### Inherited from

PluginManager.componentList

#### Defined in

[packages/core/shared/src/plugin.ts:179](https://github.com/Oneirocom/Magick/blob/eb9f05ef/packages/core/shared/src/plugin.ts#L179)

___

### pluginList

• **pluginList**: [`ServerPlugin`](ServerPlugin.md)[]

#### Overrides

PluginManager.pluginList

#### Defined in

[packages/core/shared/src/plugin.ts:405](https://github.com/Oneirocom/Magick/blob/eb9f05ef/packages/core/shared/src/plugin.ts#L405)

___

### plugins

• **plugins**: `any`

#### Inherited from

PluginManager.plugins

#### Defined in

[packages/core/shared/src/plugin.ts:180](https://github.com/Oneirocom/Magick/blob/eb9f05ef/packages/core/shared/src/plugin.ts#L180)

## Methods

### getAgentStartMethods

▸ **getAgentStartMethods**(): `Record`<`string`, (`args`: `any`) => `void` \| `Promise`<`void`\>\>

#### Returns

`Record`<`string`, (`args`: `any`) => `void` \| `Promise`<`void`\>\>

#### Defined in

[packages/core/shared/src/plugin.ts:411](https://github.com/Oneirocom/Magick/blob/eb9f05ef/packages/core/shared/src/plugin.ts#L411)

___

### getAgentStopMethods

▸ **getAgentStopMethods**(): `Record`<`string`, (`args`: `any`) => `void` \| `Promise`<`void`\>\>

#### Returns

`Record`<`string`, (`args`: `any`) => `void` \| `Promise`<`void`\>\>

#### Defined in

[packages/core/shared/src/plugin.ts:424](https://github.com/Oneirocom/Magick/blob/eb9f05ef/packages/core/shared/src/plugin.ts#L424)

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

[packages/core/shared/src/plugin.ts:235](https://github.com/Oneirocom/Magick/blob/eb9f05ef/packages/core/shared/src/plugin.ts#L235)

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

[packages/core/shared/src/plugin.ts:250](https://github.com/Oneirocom/Magick/blob/eb9f05ef/packages/core/shared/src/plugin.ts#L250)

___

### getInputTypes

▸ **getInputTypes**(): [`PluginIOType`](../#pluginiotype)[]

#### Returns

[`PluginIOType`](../#pluginiotype)[]

#### Inherited from

PluginManager.getInputTypes

#### Defined in

[packages/core/shared/src/plugin.ts:190](https://github.com/Oneirocom/Magick/blob/eb9f05ef/packages/core/shared/src/plugin.ts#L190)

___

### getNodes

▸ **getNodes**(): `Object`

#### Returns

`Object`

#### Inherited from

PluginManager.getNodes

#### Defined in

[packages/core/shared/src/plugin.ts:210](https://github.com/Oneirocom/Magick/blob/eb9f05ef/packages/core/shared/src/plugin.ts#L210)

___

### getOutputTypes

▸ **getOutputTypes**(): [`PluginIOType`](../#pluginiotype)[]

#### Returns

[`PluginIOType`](../#pluginiotype)[]

#### Inherited from

PluginManager.getOutputTypes

#### Defined in

[packages/core/shared/src/plugin.ts:200](https://github.com/Oneirocom/Magick/blob/eb9f05ef/packages/core/shared/src/plugin.ts#L200)

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

[packages/core/shared/src/plugin.ts:225](https://github.com/Oneirocom/Magick/blob/eb9f05ef/packages/core/shared/src/plugin.ts#L225)

___

### getServerInits

▸ **getServerInits**(): [`ServerInits`](../#serverinits)

#### Returns

[`ServerInits`](../#serverinits)

#### Defined in

[packages/core/shared/src/plugin.ts:447](https://github.com/Oneirocom/Magick/blob/eb9f05ef/packages/core/shared/src/plugin.ts#L447)

___

### getServerRoutes

▸ **getServerRoutes**(): [`Route`](../#route)[]

#### Returns

[`Route`](../#route)[]

#### Defined in

[packages/core/shared/src/plugin.ts:459](https://github.com/Oneirocom/Magick/blob/eb9f05ef/packages/core/shared/src/plugin.ts#L459)

___

### getServices

▸ **getServices**(): [`string`, (`app`: `any`) => `void`][]

#### Returns

[`string`, (`app`: `any`) => `void`][]

#### Defined in

[packages/core/shared/src/plugin.ts:437](https://github.com/Oneirocom/Magick/blob/eb9f05ef/packages/core/shared/src/plugin.ts#L437)

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

[packages/core/shared/src/plugin.ts:186](https://github.com/Oneirocom/Magick/blob/eb9f05ef/packages/core/shared/src/plugin.ts#L186)
