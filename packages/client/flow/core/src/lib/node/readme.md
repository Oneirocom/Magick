# Node Components

This folder contains the main node components used to render individual nodes within a spell graph.

## Components

- `BaseNode`: A base component that renders a node with its inputs, outputs, and configuration. It handles node state, such as running, error, and done states, and receives spell events to update its state accordingly.

- `CoreNode`: A component that extends `BaseNode` and adds functionality specific to the application's core nodes, such as handling node state resets and error notifications.

- `ReadOnlyNode`: A component that extends `BaseNode` and sets up a read-only version of the node.

- `NodeContainer`: A component that wraps the node content and provides the node's visual appearance, such as the title, category color, and state indicators (e.g., selected, running, error, or done).

## Usage

```jsx
import { CoreNode, ReadOnlyNode } from '@magickml/flow-core'
```

Then, render the `CoreNode` or `ReadOnlyNode` component within your flow component, passing in the required props:

```jsx
<CoreNode
  id={id}
  data={data}
  spec={spec}
  selected={selected}
  allSpecs={allSpecs}
  spell={spell}
  nodeJSON={nodeJSON}
/>
```

```jsx
<ReadOnlyNode
  id={id}
  data={data}
  spec={spec}
  selected={selected}
  allSpecs={allSpecs}
  spell={spell}
  nodeJSON={nodeJSON}
/>
```

The `BaseNode` component is not meant to be used directly but rather extended by `CoreNode` and `ReadOnlyNode` or any other custom node components.

## Props

The `CoreNode` and `ReadOnlyNode` components accept the following props:

- `id`: A string representing the unique identifier of the node.
- `data`: An object containing the node's data, such as its configuration and socket values.
- `spec`: An object of type `NodeSpecJSON` representing the node's specification.
- `selected`: A boolean indicating whether the node is currently selected.
- `allSpecs`: An array of `NodeSpecJSON` objects representing all available node specifications.
- `spell`: An object of type `SpellInterfaceWithGraph` representing the current spell.
- `nodeJSON`: An object of type `NodeJSON` representing the node's JSON data.

## Customization

The `BaseNode` component handles the rendering of the node's inputs, outputs, and configuration. You can modify the appearance and behavior of the node by editing the `BaseNode` component and its dependencies, such as the `InputSocket` and `OutputSocket` components.

The `CoreNode` and `ReadOnlyNode` components extend `BaseNode` and add application-specific functionality. You can customize these components by modifying their respective files.

## Example

You can find an example of how these node components are used within the `BaseFlow` component in the [base-flow.tsx](./flow/base-flow.tsx) file.