---
title: Fine Tuning
description: Information about fine-tuning models on your own data.
hide_table_of_contents: true
sidebar_position: 5
---

# Fine Tuning

You can add your own data to most large language models, giving them a much higher likelihood to respond in a way you might want.

It'd be nice to just dump your data raw out of whatever program you use into the AI, and be done with it. For some tasks, that will actually work (chat logs, for example). However, it's not always so straightforward.

For language models, you need to fine-tune a pair of prompts and completions, framed as an input and response.

Here's an example:

Prompt:
```
Tweet: I'm so excited to see the new release from Magick!
[Sentiment, Topic]:
```
Completion
```
[Excited, Magick]
```

For OpenAI's fine-tuning, your data has to be formatted in this way, in pairs. We are working on tools to help make this easier, but generally, when you are trying to fine-tune, it's best to frame it in the same way as where you got the data. For example, if you're training on email data, you can make a fine-tune of that and then make a prompt that matches that format to get the expected result.

As a rule of thumb, you'll need 400-500 documents to perform a fine-tune, although you can use thousands. These documents can be individual emails, tweet threads, pages from a book, etc.

## Fine Tuning in Magick

Magick has an interface for making fine-tuned models. This is in ongoing development, and the current version is fairly bare bones. Currently you can upload JSON and manage your fine-tunes with OpenAI. The near-term plan is a rich in-editor experience for importing your own data and automatically building the prompt/completion pairs for fine-tuning based on a task objective you select.
