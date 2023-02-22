# UX Improvement Ideas

As title suggests, ideas on how we can further improve the UX of the MagickML.

Includes UI fixes, QoL changes, and other relevant usability features.

<hr>

## Application

### Top Bar

> Rename ``Windows`` (easily confused for the OS), to ``Window``. This is what it's called in other editors, namely Blender and Unity.

> Add ``Preferences`` under ``File``, which would eventually house user customization options such as themes, keybinds, etc.

### Left-Side Bar

> Add ``On-Hover`` tooltips for each Button. EG: **Wand Icon** -> "Graph", **Book** -> "Fine Tuning", **Server** -> "Events", etc.

<hr>

## Graph

### Visuals

> Work on input/output knob colors, and connector line colors.

> Reorder the standard sequence of ``Output``, ``Trigger``, etc inputs of a node, to avoid connector lines crossing so often.

### Controls

> ``Mouse3`` as default control for moving the viewport around the graph. Currently performed by ``Mouse1``. 

> Having changed dragging viewport from ``Mouse1`` to ``Mouse3``, you free up ``Mouse1 -> Drag`` for a bounding box to select multiple Leaves at once. Typical control in other graph editors (as well as most RTS games).

> ``Mouse1`` on the graph canvas should deselect currently selected node. Currently there is no way to deselect.

> Holding ``Shift`` while dragging a node to lower DPI and allow fine movements.

> Holding ``CTRL`` while dragging a node for Snap-to-Grid.

### Toolbox

Currently, the only way to add a new node to the Spellbook is right clicking a blank segment of the canvas, and navigating a hierarchical dropdown menu.

This is convenient for the most frequently used items, but it takes the place of a **Context Menu**, which would have features like ``Duplicate``, ``Rename``, ``Copy``, ``Paste``, ``Delete``, etc.

What is currently shown when you right click the canvas could be collapsed under an ``Add >`` button under such a **Context Menu**.

More importantly, as more and more Node Types become available, the need for some better discoverability of nodes becomes necessary. Here are some possible solutions:

> Create an ``Add > Search`` context, which takes a string and displays all node types with matching names or descriptions.

> Create a **Toolbox** Window, which would show folders categorizing each possible node. These could be dragged and dropped into the Composer's Graph for use.

> Given a **Toolbox**, allow users to save a fully configured node under a ``Presets`` folder, which they could drag in any time later.