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

[packages/engine/src/lib/plugin.ts:399](https://github.com/Oneirocom/MagickML/blob/f4db6e49/packages/engine/src/lib/plugin.ts#L399)

## Properties

### componentList

• **componentList**: `Record`<`string`, `never`\>

#### Inherited from

PluginManager.componentList

#### Defined in

[packages/engine/src/lib/plugin.ts:182](https://github.com/Oneirocom/MagickML/blob/f4db6e49/packages/engine/src/lib/plugin.ts#L182)

___

### pluginList

• **pluginList**: [`ServerPlugin`](ServerPlugin.md)[]

#### Overrides

PluginManager.pluginList

#### Defined in

[packages/engine/src/lib/plugin.ts:398](https://github.com/Oneirocom/MagickML/blob/f4db6e49/packages/engine/src/lib/plugin.ts#L398)

___

### plugins

• **plugins**: `any`

#### Inherited from

PluginManager.plugins

#### Defined in

[packages/engine/src/lib/plugin.ts:183](https://github.com/Oneirocom/MagickML/blob/f4db6e49/packages/engine/src/lib/plugin.ts#L183)

## Methods

### getAgentStartMethods

▸ **getAgentStartMethods**(): `Record`<`string`, (`args`: `any`) => `void` \| `Promise`<`void`\>\>

#### Returns

`Record`<`string`, (`args`: `any`) => `void` \| `Promise`<`void`\>\>

#### Defined in

[packages/engine/src/lib/plugin.ts:404](https://github.com/Oneirocom/MagickML/blob/f4db6e49/packages/engine/src/lib/plugin.ts#L404)

___

### getAgentStopMethods

▸ **getAgentStopMethods**(): `Record`<`string`, (`args`: `any`) => `void` \| `Promise`<`void`\>\>

#### Returns

`Record`<`string`, (`args`: `any`) => `void` \| `Promise`<`void`\>\>

#### Defined in

[packages/engine/src/lib/plugin.ts:418](https://github.com/Oneirocom/MagickML/blob/f4db6e49/packages/engine/src/lib/plugin.ts#L418)

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

[packages/engine/src/lib/plugin.ts:442](https://github.com/Oneirocom/MagickML/blob/f4db6e49/packages/engine/src/lib/plugin.ts#L442)

___

### getServerRoutes

▸ **getServerRoutes**(): [`Route`](../#route)[]

#### Returns

[`Route`](../#route)[]

#### Defined in

[packages/engine/src/lib/plugin.ts:454](https://github.com/Oneirocom/MagickML/blob/f4db6e49/packages/engine/src/lib/plugin.ts#L454)

___

### getServices

▸ **getServices**(): [`string`, (`app`: `any`) => `void`][]

#### Returns

[`string`, (`app`: `any`) => `void`][]

#### Defined in

[packages/engine/src/lib/plugin.ts:432](https://github.com/Oneirocom/MagickML/blob/f4db6e49/packages/engine/src/lib/plugin.ts#L432)

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
