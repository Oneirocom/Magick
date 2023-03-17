---
title: Prompts
description: This is where you will find information relevant to Few Shots.
hide_table_of_contents: true
sidebar_position: 5
---

# Prompts

Prompts are plain human-language instructions that we give to AI models to do what we want them to do.

A good example of a language prompt would be:
```
Write a list of the top 10 scifi movies of all time-- and NO SEQUELS!!!
```

Similarly you might see some interesting prompts for stable diffusion or Midjourney:
```
THE CHERRY BLOSSOM TREE HOUSE :: beautiful ornate treehouse in a gigantic pink cherry blossom tree :: on a high blue grey and brown cliff with light snow and pink cherry blossom trees :: Roger Deakins and Moebius and Alphonse Much and Guweiz :: Intricate details, very realistic, cinematic lighting, volumetric lighting, photographic, --ar 9:20 --no blur bokeh defocus dof --s 4000
```

Clearly there's some dark magick going on in that last bit, but generally you, as a human, can read and write it.

Prompts are the interface between us and the models we use.

## Why Not Just Use Code?

We use a lot of code, actually. However, code is not great at handling tasks that require complex decision making. In the past, we would create really complex rulesets about words (called grammars) and use these in complex algorithms to try and solve these decision making problems. This worked well sometimes, not not across the board, certainly not enough to replace human decision makers.

We can write more and more code to solve a problem, but the more we do, the less it can flexible solve other problems.

That's why this new era of AI models is so incredible. We can show the AI model the data, give it an instruction and usually get a result instantly. As long as you have the building blocks to move data around, you can use AI to not only solve problems you would other wise need to use code for, but solve classes of problems simply couldn't be solved with code outside of a very expensive, enterprise-grade system.

Prompts let us describe what we need, hand it to the AI, and it gets done.

## Building Prompts

A lot of what we do in Magick is building prompts. There are a lot of ways to do this, but the easiest is using the "Prompt Template" or "Generator" nodes. The Generator uses the same interface as the Prompt Template but sends the template to a language model.

What is unique about the Generator is that you can inject variables into it-- i.e. you can add inputs, send some other pieces of text into the Generator and combine them together.

You can use this to build short term conversational memory for a personal assistant, data retrieval and processing for an automation agent or a tool to visit websites and scrape data. Building prompts is one of the most important parts of using Magick's full power.