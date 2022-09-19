- feathers server for primary work using socket IO
- user connects to the server with proper authentication headers right away
- when socket connects, we add a spellManager to the socket for use during the lifetime of the socket connection
  - spell manager contains a map of all spell runners or each spell
  - spell manager is responsible for initiating spell runners for spells not in the map
  - spell manager is responsible for destroying a spell runner when a spell is removed from the session
- each open tab will request that spell connection, which will cause the spell manager to load the spell into memory for that sessions usage
  - when a tab closes, we will remove that spell form the spell manager to conserve memory
- we can send custom events UP to the client, which we use to publish the events required by the spell runner
  - node id of the worker that was ruin, as well as any results
  - this comes from passing in the IO and socket connection to the spell manager
  - spell manager boots up each spell runner with the IO and the socket
- we will likely want to create "channels" for the userId and the running spell.
  - this channel would allow us to restrict the running of an individual spell to the owner itself
    - allows us to target the right user when we are sending results of spell running
- when a spell "runs" we send a message to the spellRunner service with the spell we want to "run"
  - spell runner service will then use the spell manager to find the spell loaded in memory
  - spell runner runs that spell runner, which triggers off the sequence of emitted messages of each node
    - should also send a "completed" message at the end of the runtime
    - or perhaps we send back the result of the spell runner as the result of that running.
      - this will keep us REST compliant as well, as the service will still return a result event without sockets

Implementation notes

- we want to find a way to still "run" the graph to take advantage of other plugins, like console. However we want this run of the graph to just be populated with cached data from the REAL run that happened on the server.
- As the spell is running on the server, it is pushing up values to the socket plugin which is caching those values for that node run.
- When the spell runner is done running the spell, it sends up a 'completed' event. When the client receives this event, it will trigger off the graph to "run" as normal. However, in doing so, each worker will only return the cached output data that was received during the server run phase.
- the worker returns this value, passing to the next node as normal.
- not sure quite how this will interact with having components which connect to full streams of data. In this case we actually just "play" and "pause" spells, and when playing they are streaming their events up to the client.

TO DO

- create new default thoth interface using generic APIs (OpenAI, AI21, etc)\
- build thoth interface directly off feathers services
  - or just inject the whole feathers app service interface into the engine context when running
- USER AUTH
- fix docker setup to all run at once and document it

SERVICES

- user service
- cache service
- agent service
- weaviate service
- huggingface service
- completion service (or ML service?)
- event service
- search service
- speed service
- entity service
- document service
