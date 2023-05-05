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
| `«destructured»` | `PluginConstuctor` & { `agentMethods?`: { `start`: (`args`: `any`) => `void` \| `Promise`<`void`\> ; `stop`: (`args`: `any`) => `void` \| `Promise`<`void`\>  } ; `serverInit?`: [`ServerInit`](../#serverinit) ; `serverRoutes?`: [`Route`](../#route)[] ; `services?`: (`app`: `any`) => `void`[]  } |

#### Overrides

Plugin.constructor

#### Defined in

[packages/core/shared/src/plugin.ts:137](https://github.com/Oneirocom/Magick/blob/eb9f05ef/packages/core/shared/src/plugin.ts#L137)

## Properties

### agentMethods

• `Optional` **agentMethods**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `start` | (`args`: `any`) => `void` \| `Promise`<`void`\> |
| `stop` | (`args`: `any`) => `void` \| `Promise`<`void`\> |

#### Defined in

[packages/core/shared/src/plugin.ts:132](https://github.com/Oneirocom/Magick/blob/eb9f05ef/packages/core/shared/src/plugin.ts#L132)

___

### completionProviders

• **completionProviders**: [`CompletionProvider`](../#completionprovider)[]

#### Inherited from

Plugin.completionProviders

#### Defined in

[packages/core/shared/src/plugin.ts:62](https://github.com/Oneirocom/Magick/blob/eb9f05ef/packages/core/shared/src/plugin.ts#L62)

___

### inputTypes

• **inputTypes**: [`PluginIOType`](../#pluginiotype)[]

#### Inherited from

Plugin.inputTypes

#### Defined in

[packages/core/shared/src/plugin.ts:59](https://github.com/Oneirocom/Magick/blob/eb9f05ef/packages/core/shared/src/plugin.ts#L59)

___

### name

• **name**: `string`

#### Inherited from

Plugin.name

#### Defined in

[packages/core/shared/src/plugin.ts:57](https://github.com/Oneirocom/Magick/blob/eb9f05ef/packages/core/shared/src/plugin.ts#L57)

___

### nodes

• **nodes**: [`MagickComponentArray`](../#magickcomponentarray)<`any`\>

#### Inherited from

Plugin.nodes

#### Defined in

[packages/core/shared/src/plugin.ts:58](https://github.com/Oneirocom/Magick/blob/eb9f05ef/packages/core/shared/src/plugin.ts#L58)

___

### outputTypes

• **outputTypes**: [`PluginIOType`](../#pluginiotype)[]

#### Inherited from

Plugin.outputTypes

#### Defined in

[packages/core/shared/src/plugin.ts:60](https://github.com/Oneirocom/Magick/blob/eb9f05ef/packages/core/shared/src/plugin.ts#L60)

___

### secrets

• **secrets**: [`PluginSecret`](../#pluginsecret)[]

#### Inherited from

Plugin.secrets

#### Defined in

[packages/core/shared/src/plugin.ts:61](https://github.com/Oneirocom/Magick/blob/eb9f05ef/packages/core/shared/src/plugin.ts#L61)

___

### serverInit

• `Optional` **serverInit**: [`ServerInit`](../#serverinit)

#### Defined in

[packages/core/shared/src/plugin.ts:131](https://github.com/Oneirocom/Magick/blob/eb9f05ef/packages/core/shared/src/plugin.ts#L131)

___

### serverRoutes

• `Optional` **serverRoutes**: [`Route`](../#route)[]

#### Defined in

[packages/core/shared/src/plugin.ts:136](https://github.com/Oneirocom/Magick/blob/eb9f05ef/packages/core/shared/src/plugin.ts#L136)

___

### services

• **services**: (`app`: `any`) => `void`[]

#### Defined in

[packages/core/shared/src/plugin.ts:130](https://github.com/Oneirocom/Magick/blob/eb9f05ef/packages/core/shared/src/plugin.ts#L130)
