# Allow developers to fetch and modify state object using nodes

## Metadata

- Status: accepted <!-- draft | proposed | rejected | accepted | deprecated | superseded by -->
- Deciders: Magick, fire, benbot
- Tags: Magick, xstate, fetch, embedding

## Context and Problem Statement

Developers currently struggle with fetching and modifying the state object using xstate. We aim to back this state object by a PostgreSQL database jsonb attribute.

## Proposed Solution

Integrate XState with PostgreSQL converting state objects into JSONB format for storage and retrieval.

## Implementation

Assuming correctly operated database, we create a retejs node that matches embedding interface but for xstate states. The first draft is a constant value stub.

## Positive Consequences

- Simple fetching and modification of the state object.
- Efficient operations on JSON data leveraging PostgreSQL's JSONB datatype.
- Enhanced data persistence and recovery.
- Allows easy fetching and modification of the state object.

## Negative Consequences

- Complex due to database operations.
- Requires proper handling and conversion of the state object to/from JSONB.

## Option graveyard

Previous suggestion: Store state object in plain text lacking advanced capabilities like indexing provided by JSONB.

## If this enhancement will be used infrequently, can it be worked around with a few nodes?

This cannot simply be achieved via nodes. Integrating the state object with PostgreSQL is critical for an efficient state machine.

## Is there a reason why this should be core and done by us?

Incorporating this directly into our core system ensures reliability and seamless developer experience. This adds value by expanding our platform's capabilities and facilitating better application state management.

## References

- [XState Documentation](https://xstate.js.org/docs/)
