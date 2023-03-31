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

[packages/engine/src/lib/plugin.ts:400](https://github.com/Oneirocom/MagickML/blob/1bc5ce20/packages/engine/src/lib/plugin.ts#L400)

## Properties

### componentList

• **componentList**: `Record`<`string`, `never`\>

#### Inherited from

PluginManager.componentList

#### Defined in

[packages/engine/src/lib/plugin.ts:183](https://github.com/Oneirocom/MagickML/blob/1bc5ce20/packages/engine/src/lib/plugin.ts#L183)

___

### pluginList

• **pluginList**: [`ServerPlugin`](ServerPlugin.md)[]

#### Overrides

PluginManager.pluginList

#### Defined in

[packages/engine/src/lib/plugin.ts:399](https://github.com/Oneirocom/MagickML/blob/1bc5ce20/packages/engine/src/lib/plugin.ts#L399)

___

### plugins

• **plugins**: `any`

#### Inherited from

PluginManager.plugins

#### Defined in

[packages/engine/src/lib/plugin.ts:184](https://github.com/Oneirocom/MagickML/blob/1bc5ce20/packages/engine/src/lib/plugin.ts#L184)

## Methods

### getAgentStartMethods

▸ **getAgentStartMethods**(): `Record`<`string`, (`args`: `any`) => `void` \| `Promise`<`void`\>\>

#### Returns

`Record`<`string`, (`args`: `any`) => `void` \| `Promise`<`void`\>\>

#### Defined in

[packages/engine/src/lib/plugin.ts:405](https://github.com/Oneirocom/MagickML/blob/1bc5ce20/packages/engine/src/lib/plugin.ts#L405)

___

### getAgentStopMethods

▸ **getAgentStopMethods**(): `Record`<`string`, (`args`: `any`) => `void` \| `Promise`<`void`\>\>

#### Returns

`Record`<`string`, (`args`: `any`) => `void` \| `Promise`<`void`\>\>

#### Defined in

[packages/engine/src/lib/plugin.ts:419](https://github.com/Oneirocom/MagickML/blob/1bc5ce20/packages/engine/src/lib/plugin.ts#L419)

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

[packages/engine/src/lib/plugin.ts:243](https://github.com/Oneirocom/MagickML/blob/1bc5ce20/packages/engine/src/lib/plugin.ts#L243)

___

### getInputTypes

▸ **getInputTypes**(): [`PluginIOType`](../#pluginiotype)[]

#### Returns

[`PluginIOType`](../#pluginiotype)[]

#### Inherited from

PluginManager.getInputTypes

#### Defined in

[packages/engine/src/lib/plugin.ts:194](https://github.com/Oneirocom/MagickML/blob/1bc5ce20/packages/engine/src/lib/plugin.ts#L194)

___

### getNodes

▸ **getNodes**(): `Object`

#### Returns

`Object`

#### Inherited from

PluginManager.getNodes

#### Defined in

[packages/engine/src/lib/plugin.ts:215](https://github.com/Oneirocom/MagickML/blob/1bc5ce20/packages/engine/src/lib/plugin.ts#L215)

___

### getOutputTypes

▸ **getOutputTypes**(): [`PluginIOType`](../#pluginiotype)[]

#### Returns

[`PluginIOType`](../#pluginiotype)[]

#### Inherited from

PluginManager.getOutputTypes

#### Defined in

[packages/engine/src/lib/plugin.ts:205](https://github.com/Oneirocom/MagickML/blob/1bc5ce20/packages/engine/src/lib/plugin.ts#L205)

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

[packages/engine/src/lib/plugin.ts:232](https://github.com/Oneirocom/MagickML/blob/1bc5ce20/packages/engine/src/lib/plugin.ts#L232)

___

### getServerInits

▸ **getServerInits**(): [`ServerInits`](../#serverinits)

#### Returns

[`ServerInits`](../#serverinits)

#### Defined in

[packages/engine/src/lib/plugin.ts:443](https://github.com/Oneirocom/MagickML/blob/1bc5ce20/packages/engine/src/lib/plugin.ts#L443)

___

### getServerRoutes

▸ **getServerRoutes**(): [`Route`](../#route)[]

#### Returns

[`Route`](../#route)[]

#### Defined in

[packages/engine/src/lib/plugin.ts:455](https://github.com/Oneirocom/MagickML/blob/1bc5ce20/packages/engine/src/lib/plugin.ts#L455)

___

### getServices

▸ **getServices**(): [`string`, (`app`: `Application`<`any`, `any`\>) => `void`][]

#### Returns

[`string`, (`app`: `Application`<`any`, `any`\>) => `void`][]

#### Defined in

[packages/engine/src/lib/plugin.ts:433](https://github.com/Oneirocom/MagickML/blob/1bc5ce20/packages/engine/src/lib/plugin.ts#L433)

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

[packages/engine/src/lib/plugin.ts:190](https://github.com/Oneirocom/MagickML/blob/1bc5ce20/packages/engine/src/lib/plugin.ts#L190)
