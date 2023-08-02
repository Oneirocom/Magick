# Xstate test

1. Xstate test

```json
{
  "id": "promise",
  "initial": "pending",
  "states": {
    "pending": {
      "on": {
        "RESOLVE": { "target": "resolved" },
        "REJECT": { "target": "rejected" }
      }
    },
    "resolved": {},
    "rejected": {}
  }
}
```

2. Event 

```
RESOLVE
```

3. Context

```json
{}
```

4. Output

```
// ...
"value": "resolved"
// ...
```
