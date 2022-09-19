Refactoring

- Revert all core components
- organise components into folders for easy visibility into ownership and core functionality
- better use of interfaces. All client completions cant still go direct against latitude

- add dev flags for components not intended for production

Development Flow

- easiest version
  - log in with latitude account, it gets an API key for you and populate syour local DB. Away you go.
  - or can turn off latitude auth, and develop locally with a private API access key.

Questions

- if we have the client run against the latitude API directly, we reduce needing of duplicating endpoints in thothserver just to proxy through to latitude API. However that would require users developing to have a latitude account to run our interface for thoth on the client side.
- we could mirror the latitude API in the thoth API and have all client calls first go to thoth server. Might work well.
- Perhaps the real solution here is that all everything latitude related should go through a dedicated interface and no mirror any endpoints?
- how do we allow other plugin components running on the server to use the latitude API from server-side? Need the api key for the user stored in the DB. Or a token override provided. Maybe .env latitude api token overrides the user based on in the DB if it exists?

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
    components: Record<string, ThothComponent>,
    inspectorControls: Record<string, InspectorControl>,
    plugins: ThothPlugin[],
    connectors: Recird<string, Connector>
  },
  client: {
    windows: Record<string, WindowComponent>
    events: Record<string, Event>
    inspectorComponents: Record<string, InspectorComponent>,
    interface: ThothInterface,
    menuBar: Record<string, MenuBar>
    // or maybe this, which would load in all the above itself ands expose a single component.
    // Perhaps our client library (or client-core) gives a provider that lets people load these things into thoth from their individual app.
    appRoot: MyAppThothRootComponent
  }
  server: {
    interface: ThothInterface,
    // Good for custom routes for the app
    routes: Record<string, RouteDefinition>
  }
}
```
