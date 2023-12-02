Agent events
Events are a pubsub mechanism to communicate with agents and have them stream data back

agent:{agentId}:event:run
agent:{agentId}:event:spell
agent:{agentId}:event:log
agent:{agentId}:event:warn
agent:{agentId}:event:error
agent:{agentId}:event:command

Agent jobs
Jobs are a 1 to 1 relationship with agents and are used to do a thing once or on a schedule

agent:{agentId}:job:run
agent:{agentId}:job:update
agent:{agentId}:job:delete

Plugin events

agent:{agentId}:{pluginName}:event

agent:{agentId}:spellBook:play
agent:{agentId}:spellBook:pause
