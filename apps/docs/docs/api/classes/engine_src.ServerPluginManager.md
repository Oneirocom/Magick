---
id: "engine_src.ServerPluginManager"
title: "Class: ServerPluginManager"
sidebar_label: "engine/src.ServerPluginManager"
custom_edit_url: null
---

[engine/src](../modules/engine_src.md).ServerPluginManager

## Hierarchy

- `PluginManager`

  ↳ **`ServerPluginManager`**

## Constructors

### constructor

• **new ServerPluginManager**()

#### Overrides

PluginManager.constructor

#### Defined in

[packages/engine/src/lib/plugin.ts:400](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/plugin.ts#L400)

## Properties

### componentList

• **componentList**: `Record`<`string`, `never`\>

#### Inherited from

PluginManager.componentList

#### Defined in

[packages/engine/src/lib/plugin.ts:183](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/plugin.ts#L183)

___

### pluginList

• **pluginList**: [`ServerPlugin`](engine_src.ServerPlugin.md)[]

#### Overrides

PluginManager.pluginList

#### Defined in

[packages/engine/src/lib/plugin.ts:399](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/plugin.ts#L399)

___

### plugins

• **plugins**: `any`

#### Inherited from

PluginManager.plugins

#### Defined in

[packages/engine/src/lib/plugin.ts:184](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/plugin.ts#L184)

## Methods

### getAgentStartMethods

▸ **getAgentStartMethods**(): `Record`<`string`, (`args`: `any`) => `void` \| `Promise`<`void`\>\>

#### Returns

`Record`<`string`, (`args`: `any`) => `void` \| `Promise`<`void`\>\>

#### Defined in

[packages/engine/src/lib/plugin.ts:405](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/plugin.ts#L405)

___

### getAgentStopMethods

▸ **getAgentStopMethods**(): `Record`<`string`, (`args`: `any`) => `void` \| `Promise`<`void`\>\>

#### Returns

`Record`<`string`, (`args`: `any`) => `void` \| `Promise`<`void`\>\>

#### Defined in

[packages/engine/src/lib/plugin.ts:419](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/plugin.ts#L419)

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

[packages/engine/src/lib/plugin.ts:443](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/plugin.ts#L443)

___

### getServerRoutes

▸ **getServerRoutes**(): [`Route`](../modules/engine_src.md#route)[]

#### Returns

[`Route`](../modules/engine_src.md#route)[]

#### Defined in

[packages/engine/src/lib/plugin.ts:455](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/plugin.ts#L455)

___

### getServices

▸ **getServices**(): [`string`, (`app`: `Application`<`any`, `any`\>) => `void`][]

#### Returns

[`string`, (`app`: `Application`<`any`, `any`\>) => `void`][]

#### Defined in

[packages/engine/src/lib/plugin.ts:433](https://github.com/Oneirocom/MagickML/blob/f74165ec/packages/engine/src/lib/plugin.ts#L433)

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
