## Notes

- Need a universal structure for models and options
- each model should have different defaults provided for itself
- model switcher needs to live in thoth-core, but is consumed on the react client to populate the data options
- provide all values needed and filter on frontend rather than programmatically add or remove inspector elements

## MODEL DATA SHAPES

GPT-J completion

{
"model": "gpt-j-6b-story-gutenberg-rw-bibliotik-raw",
"modelSource": "coreweave",
"text": "A long time ago, in a galaxy far far away there was",
"length": 45,
"topP": 0.9,
"n": 4,
"temperature": 1
}

ForeFront

{
"modelSource": "forefront",
"model": "forefront model",
"prompt": "A long time ago, in a galaxy far far away there was",
"maxTokens": 50,
"topP": 0.9,
"n": 2,
"universalFormat": true,
"temperature": 1
}

Jurassic 1 Jumbo

{
"model": "j1-jumbo",
"modelSource": "ai21",
"prompt": "A long time ago, in a galaxy far far away there was",
"maxTokens": 45,
"n": 3,
"temperature": 1,
"stop": "\n"
}

Jurassic 1 large

{
"model": "j1-large",
"modelSource": "ai21",
"prompt": "A long time ago, in a galaxy far far away there was",
"maxTokens": 45,
"n": 3,
"temperature": 1,
"stop": "\n"
}

Open AI

{
"universalFormat": true,
"prompt": "Once upon a time in a forgotten forest",
"presencePenalty": 0.0,
"temperature": 0.7,
"maxTokens": 120,
"n":3,
"logitBias":{},
"getFullResponse":true,
"context": {
"productTaskName": "testTaskName",
"productRequestId": "textRequestId",
"userId": "225",
"fewshotText": "testFewshotText"
}
}
