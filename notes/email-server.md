Flow:
- user can give the agent instructions for responding to emails.  Could be done conversationally.
- inbound email comes in. Passes into plugin.
- Plugin takes data and passes it into a spell.
- Data passes into an agents spell.  Agent recalls above instructions.
- Agent drafts up an email based upon its knowledge and instructions.  Could have an interface to object this data in via variables.
- drafted email is sent out via haraka.  Or could be added to drafts for a live user to confirm before sending.
- agent could also send out a notification via slack that an email has been sent.






Writing a haraka plugin
https://github.com/haraka/Haraka/blob/master/docs/Plugins.md

Documentation on sending email from a plugin in haraka
https://github.com/haraka/Haraka/blob/master/docs/Outbound.md#creating-a-mail-internally-for-outbound-delivery
