---
id: "ServerPlugin"
title: "Class: ServerPlugin"
sidebar_label: "ServerPlugin"
sidebar_position: 0
custom_edit_url: null
---

## Hierarchy

- `Plugin`

  ↳ **`ServerPlugin`**

## Constructors

### constructor

• **new ServerPlugin**(`«destructured»`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `PluginConstuctor` & { `agentMethods?`: { `start`: (`args`: `any`) => `void` \| `Promise`<`void`\> ; `stop`: (`args`: `any`) => `void` \| `Promise`<`void`\>  } ; `serverInit?`: [`ServerInit`](../#serverinit) ; `serverRoutes?`: [`Route`](../#route)[] ; `services?`: (`app`: `Application`<`any`, `any`\>) => `void`[]  } |

#### Overrides

Plugin.constructor

#### Defined in

[packages/engine/src/lib/plugin.ts:140](https://github.com/Oneirocom/MagickML/blob/563ea9fe/packages/engine/src/lib/plugin.ts#L140)

## Properties

### agentMethods

• `Optional` **agentMethods**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `start` | (`args`: `any`) => `void` \| `Promise`<`void`\> |
| `stop` | (`args`: `any`) => `void` \| `Promise`<`void`\> |

#### Defined in

[packages/engine/src/lib/plugin.ts:135](https://github.com/Oneirocom/MagickML/blob/563ea9fe/packages/engine/src/lib/plugin.ts#L135)

___

### completionProviders

• **completionProviders**: [`CompletionProvider`](../#completionprovider)[]

#### Inherited from

Plugin.completionProviders

#### Defined in

[packages/engine/src/lib/plugin.ts:63](https://github.com/Oneirocom/MagickML/blob/563ea9fe/packages/engine/src/lib/plugin.ts#L63)

___

### inputTypes

• **inputTypes**: [`PluginIOType`](../#pluginiotype)[]

#### Inherited from

Plugin.inputTypes

#### Defined in

[packages/engine/src/lib/plugin.ts:60](https://github.com/Oneirocom/MagickML/blob/563ea9fe/packages/engine/src/lib/plugin.ts#L60)

___

### name

• **name**: `string`

#### Inherited from

Plugin.name

#### Defined in

[packages/engine/src/lib/plugin.ts:58](https://github.com/Oneirocom/MagickML/blob/563ea9fe/packages/engine/src/lib/plugin.ts#L58)

___

### nodes

• **nodes**: [`MagickComponentArray`](../#magickcomponentarray)<`any`\>

#### Inherited from

Plugin.nodes

#### Defined in

[packages/engine/src/lib/plugin.ts:59](https://github.com/Oneirocom/MagickML/blob/563ea9fe/packages/engine/src/lib/plugin.ts#L59)

___

### outputTypes

• **outputTypes**: [`PluginIOType`](../#pluginiotype)[]

#### Inherited from

Plugin.outputTypes

#### Defined in

[packages/engine/src/lib/plugin.ts:61](https://github.com/Oneirocom/MagickML/blob/563ea9fe/packages/engine/src/lib/plugin.ts#L61)

___

### secrets

• **secrets**: [`PluginSecret`](../#pluginsecret)[]

#### Inherited from

Plugin.secrets

#### Defined in

[packages/engine/src/lib/plugin.ts:62](https://github.com/Oneirocom/MagickML/blob/563ea9fe/packages/engine/src/lib/plugin.ts#L62)

___

### serverInit

• `Optional` **serverInit**: [`ServerInit`](../#serverinit)

#### Defined in

[packages/engine/src/lib/plugin.ts:134](https://github.com/Oneirocom/MagickML/blob/563ea9fe/packages/engine/src/lib/plugin.ts#L134)

___

### serverRoutes

• `Optional` **serverRoutes**: [`Route`](../#route)[]

#### Defined in

[packages/engine/src/lib/plugin.ts:139](https://github.com/Oneirocom/MagickML/blob/563ea9fe/packages/engine/src/lib/plugin.ts#L139)

___

### services

• **services**: (`app`: `Application`<`any`, `any`\>) => `void`[]

#### Defined in

[packages/engine/src/lib/plugin.ts:133](https://github.com/Oneirocom/MagickML/blob/563ea9fe/packages/engine/src/lib/plugin.ts#L133)
