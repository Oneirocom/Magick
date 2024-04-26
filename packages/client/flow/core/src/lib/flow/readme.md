# Flow Components

This folder contains the main flow components you would use to render a spell-graph.

- `BaseFlow`: A base component that sets up the ReactFlow instance with custom controls, node types, and event handlers. Anything state/pubsub is optional at this level.
- `CoreFlow`: A component that extends `BaseFlow` and adds functionality specific to the application's core flow, such as handling spell events and syncing with the server.
- `ReadOnlyFlow`: A component that extends `BaseFlow` and sets up a read-only version of the flow.

## Usage

```jsx
import { CoreFlow, ReadOnlyFlow } from '@magickml/flow-core'
```

Then, render the `CoreFlow` or `ReadOnlyFlow` component in your application, passing in the required props:

```jsx
<CoreFlow
  spell={spell}
  parentRef={parentRef}
  tab={tab}
  readOnly={false}
  windowDimensions={windowDimensions}
/>
```

```jsx
<ReadOnlyFlow
  spell={spell}
  parentRef={parentRef}
  windowDimensions={windowDimensions}
/>
```

The `BaseFlow` component is not meant to be used directly, but rather extended by `CoreFlow` and `ReadOnlyFlow` or any other custom flow components.

## Props

The `CoreFlow` and `ReadOnlyFlow` components accept the following props:

- `spell`: An object of type `SpellInterfaceWithGraph` representing the current spell.
- `parentRef`: A `React.RefObject` for the parent div element.
- `tab`: An object of type `Tab` representing the current tab. (TODO: Might be unused)
- `readOnly`: A boolean indicating whether the flow should be read-only (optional, defaults to `false` for `CoreFlow` and `true` for `ReadOnlyFlow`).
- `windowDimensions`: An object with `width` and `height` properties representing the dimensions of the window.

## Customization

The `BaseFlow` component sets up the ReactFlow instance with custom node types, edge types, and event handlers. You can modify these by editing the `BaseFlow` component and its dependencies in the `hooks` and `controls` folders.

The `CoreFlow` and `ReadOnlyFlow` components extend `BaseFlow` and add application-specific functionality. You can customize these components by modifying their respective files.

## Example

You can find an example in the [GraphWindow.tsx](../../../../../editor/src/components/GraphWindow/GraphWindow.tsx) file.