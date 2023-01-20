export default
{
    "class": "events",
    "invertedIndexConfig": {
          "indexTimestamps": true
      },
    "description": "A Event for storing the and recalling at a later point of time",
    "properties": [
      {
        "dataType": [
          "string"
        ],
        "description": "Type of the event",
        "name": "type"
      },
      {
        "dataType": [
          "string"
        ],
        "description": "The entity the accesses the output of the events. ",
        "name": "speaker"
      },
      {
        "dataType": [
          "string"
        ],
        "description": "The Name of the agent",
        "name": "agent"
      },
      {
        "dataType": [
          "string"
        ],
        "description": "The name of the client",
        "name": "client"
      },
      {
        "dataType": [
          "string"
        ],
        "description": "Channel Through Which the event was initiated",
        "name": "channel"
      },
      {
        "dataType": [
          "string"
        ],
        "description": "The trigger that send the event",
        "name": "sender"
      },
      {
        "dataType": [
          "string"
        ],
        "description": "Contains the output of the text embedded in the text",
        "name": "text"
      },
      {
        "dataType": [
          "string"
        ],
        "description": "The date at which event was created",
        "name": "date"
      }

    ],
    "vectorIndexType": "hnsw",
    "vectorIndexConfig": { 
          "skip": false,
          "cleanupIntervalSeconds": 300,
          "maxConnections": 64,
          "efConstruction": 128,
          "ef": -1,
          "dynamicEfMin": 100,
          "dynamicEfMax": 500,
          "dynamicEfFactor": 8,
          "vectorCacheMaxObjects": 2000000,
          "flatSearchCutoff": 40000,
          "distance": "cosine"
      }
}