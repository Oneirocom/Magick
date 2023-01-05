Refactoring

- Revert all core components
- organise components into folders for easy visibility into ownership and core functionality

- add dev flags for components not intended for production

NEEDS

- way for plugins to also provide their own interfaces to compose them all together for client and server runtime usage?

Modularization

We will need to have a way for an individual app load the different pieces of itself into the main application. A package would need to provide code for the client, core, and the server.

One proposed pattern, which reflect the data needs of each part of the application to function properly.

```javascript
{
  appName: 'myApp',
  icon: ".../path/to/icon",
  assets: "../path/to/assets",
  // file type used to determine what tab to type to open for this app
  fileType: "\*.agent",
  core: {
    components: Record<string, MagickComponent>,
    inspectorControls: Record<string, InspectorControl>,
    plugins: MagickPlugin[],
    connectors: Recird<string, Connector>
  },
  client: {
    windows: Record<string, WindowComponent>
    events: Record<string, Event>
    inspectorComponents: Record<string, InspectorComponent>,
    interface: MagickInterface,
    menuBar: Record<string, MenuBar>
    // or maybe this, which would load in all the above itself ands expose a single component.
    // Perhaps our client library (or client-core) gives a provider that lets people load these things into magick from their individual app.
    appRoot: MyAppMagickRootComponent
  }
  server: {
    interface: MagickInterface,
    // Good for custom routes for the app
    routes: Record<string, RouteDefinition>
  }
}
```
