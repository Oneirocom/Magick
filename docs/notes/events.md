Events

There are a number of events which are streaming from our agent server via redis. These are the events so far.

- agent:agentId
  - receives all global events for an agent (logs, warnings, errors)
- agent:agentId:spell:spellId:run
  - receives the result of a single run of a spell with inputs, variables, result
- agent:agentId:spell:spellId:nodeId
  - receives the result of running a single node of a single spell.
