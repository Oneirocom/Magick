---
title: Terminology
description: Important words
hide_table_of_contents: true
sidebar_position: 2
---

# Terminology

Unless you're an AI researcher or senior engineer there's probably going to be some amount of terminology that's new to you. We'll do our best to explain it. If you don't find any words covered here that you're curious about, please file an issue or reach out to us on Discord.

## Magick Core Concepts

Spell - A pipeline that describes data moving from one place to another. The moves through different processes we call "nodes", via wires we call "connections". Spells are run by agents as response to input. The Loop connector also alllows the agent to wake up and run a spell.

Agent - A live running process happening on a server somewhere. If you turn it on, it wakes up somewhere in the world and starts doing whatever you told it to do.

Event - Things that happen. Magick sees them as content plus metadata. If someone writes "Hello Bot" on Discord, there will be a "content" field added to the event with the value "Hello Bot".

Request - Calls out to models running on external servers, i.e. OpenAI. Requests are tracked in Magick with all of their input and output information, as well as a cost estimate.

Node - A function that transforms input data input output data, represented visually. Nodes are an abstraction layer so that designers can worry about how data flows, and not whether or not the code works. Code nodes are available, as well as Jupyter notebook connection, for people who want to use the ease of Magick but still need to code certai parts.

## AI and Search Concepts
Prompt - Plain human-language instructions that we give to AI models to do what we want them to do. This is what we actually send to the AI.

Model - The model is the actual black box AI. It usually has some form of input and some form of output, although often more code will be put on both sides to make it easy to work with.
Weights

Token - A token is a representation of data that the machine understands. There are tokens in most generative models. For language and text-to-image, tokenization happens when we break up the input words into tokens. These model only have so much capacity for different words, and there are a *lot* of possible words and word combinations, so words are broken up and turned into numbers. A word like "Paris" might be a token, but a word like "apetite" is probably three tokens.

Completion - Generative models work by loading up a prompt and generating some output. What the model is doing is called "prediction", and what it generates is known as the "completion". This can be streamed token by token or as a single final batch.

Weight - Models are made up of "weights". Each weight is a number, typically between 0 and 1, that determines how output flows from the input of the model to the output. The weights are set through "training". Training the weights of GPT-3 took weeks on more than a thousand high-end GPUs. Once the weights are set, they can be run by a much smaller system.

Fewshot - Models can be given examples of a task before they perform it. We call these "shots". A fewshot is a specific task instruction along with examples of the task being completed successfully. This costs more in tokens but can often have dramatic impact on success on certain kinds of tasks (for example, determining if a Tweet is funny, happy angry or sad).

Embedding - A piece of text or image that bas been transformed from human readable information into a form that is readable by machines, usually to capture the concept. Embeddings can be used for similarity search, i.e. since similar concepts have similar embeddings, even if they use different words. In the case of images, embeddings can be used to transfer traits like the likeness of a person (see DreamBooth). 

Vector Search / Similarity Search - Text or images that have been processed and stored along with their embeddings can be searched against other processed text/images. This can be done fast enough to run in realtime. Similarity search allows agents to access previously learned knowledge in memory and inject it back into the next prompt.


Fine Tuning - The process of adding your own data most large language models, giving them a much higher likelihood to respond in a way you might want.


## Engineering Concepts
Frontend - This is the part of an application that a user sees. If you're reading this, you're either looking at the Magick documentation server frontend or Github's frontend, or you're editing it from the frontend of VSCode. Frontends are not secure enough to hold secrets (like keys to data or other services you use for your projects) so they typically talk to backends.

Client -- Often times the client is a frontend. However, more generally, a client is anything that talks to a server. When you play Fortnite, you are using a client to talk to a server. When you log into Discord, you are using a client and talking to other clients through Discord's servers.

Backend -- This is the part of the application you don't see. A lot of logic has to happen that can't be leaked to users, especially about other users, so this needs to happen on a server that is walled off. The access point for the server is through clients, many of which are frontends.

Server -- Any machine that others can access which responds with data. This could be a virtual machine running inside of Google's cloud or it could be a Raspberry Pi in the corner. Some apps on your computer run their own server in the background. Servers are often also the backend for apps. However, ironically, frontends also run on servers.

Serverless -- Telling servers to turn on and off is a pain, but when a lot of users start coming to your app you need to be able to scale up. At the same time, you don't want to pay for a bunch of servers running when there are no users. Serverless is a way of deploying your app so that instead of turning servers on and off, the system makes containers which run copies of your app, and if more users come to visit it makes more copies. This is dynamic and often much cheaper and easier to setup for small teams which is why its popular. Oh, and to be clear-- there is *always* a server

API -- Frontends and backends need to speak the same language. For the frontend application to access the backend it will follow the spec of the backend's interface. API stands for application programming interface. Roughly it translates to "here is how to you talk to my server".

REST API -- A lot of people came up with different ways to talk to their server, and it became a huge headache for developers. Some very smart people came up with some standards, one of them being REST. APIs that follow a standard convention are known as RESTful. Also, REST APIs are usually/always HTTP / the web, while APIs are general across all kinds of software.

Database -- Databases hold your data. Usually your backend server talks to the database, using a secret password that only the backend knows. The database holds all user data, configuration, pretty much anything you would want to change or hold onto for a user.

Deployment -- When you make an app you want to get it out into the world so other people can visit it. You typically need it to run fast and be up 24/7. Managing all of this is known as deployment.

CI/CD -- Deploying is a pain, so teams typically automate the deployment to happen whenever they make a good release of code. Before the code goes up, it has to be tested, and this is automated too. The testing and verification that everything is good is called integration, so the full process is known as "continuous deployment and integrat", or CI/CD.

DevOps -- Making sure your app is deployed, your packages are built and everything is nicely automated is all DevOps. DevOps engineers are typically responsible for CI/CD, Deployment, setting up production servers, everything to get the app in front of users.

MLOps -- Similar to DevOps but focused on getting AI models into production and used by your systems or users.

### Missing Terminology?

File a ticket or edit this page!