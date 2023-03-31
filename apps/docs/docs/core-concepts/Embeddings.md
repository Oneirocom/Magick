---
title: Embeddings
description: Information about embeddings and vector search/similarity search.
hide_table_of_contents: true
sidebar_position: 5
---

# Embeddings

Embeddings themselves are kind of a complex concept. Take the concept of a word, its relation to other words, various other dimensions we don't even full understand (1536 of them exactly), and derive a complex vector from that.

For the text "Your text string goes here", the embedding looks like 
```
"embedding": [
        -0.006929283495992422,
        -0.005336422007530928,
        <a bunch more numbers>,
        -4.547132266452536e-05,
        -0.024047505110502243
      ]
```

... yeah, it's just a bunch of numbers. What do these numbers mean? Well, they sort of represent a concept, and similar concepts have similar numbers.

They are like coordinates on a map. If the coordinates are closer together, the places are closer together. Same with embeddings, just *way* more dimensions.

In generative image AI, embeddings can be created and used to capture parts of an image that can be transfered or injected into the generation of other images. A popular method of this is DreamBooth.

## Using With Events and Documents

You can process events and documents with embeddings to be retrieved later in a process known as "similarity search". See the Events section for more info.
