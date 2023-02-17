<p align="center"><img src="apps/docs/readme-files/MAGICK-banner.png" /></p>

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-11-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->
<h1 align="center">MAGICK</h1>

Magick is a visual IDE for no-code data pipelines and multimodal agents. Magick can connect to other services and comes with nodes and connectors well-suited for intelligent agents, chatbots, complex reasoning systems and realistic characters.

## Key Features

- Powerful graph-based IDE for complex data pipelines
- Realtime agents which can perform actions on their own, interact with users and other agents in different modalities with a unified memory and self
- Social connectors to Discord, Twitter and Twilio -- Zoom, Google Meet, Reddit, Slack connectors will be available soon as plugins!
- Search Google, Wikipedia and the Semantic Web
- Many included powertools, including voice and image generation and vector search
- Graphs can be embedded in subgraphs and shared for rapid community development

![image](https://user-images.githubusercontent.com/18633264/210928740-fec448aa-e6fe-4640-9587-aae109ddea12.png)

### Installation

First, clone and set up Magick

```
git clone https://github.com/Oneirocom/Magick
```

Next, install dependencies

```
npm install
```

# Run Magick!

```
npm run dev
```

# Development

There are a few things to keep in mind while this project is actively being worked on.

## Database

_Please be aware Magick is under heavy development and changes can cause your DB to be wiped. Back up your spells via export regularly._

The default setup of Magick is connected to a test database on Supabase. It will get you going, but it will likely be wiped regularly and is not a good storage for your spells.

### Deploy your own database

To deploy your own database, we suggest using Supabase or another Postgres database. The current setup for events and documents requires the `pgvector` extension to be enabled.

The following documents should help you with setup:
- https://supabase.com/docs/guides/database/connecting-to-postgres
- https://supabase.com/blog/openai-embeddings-postgres-vector

To initialize a new database, you will probably need to call migrate. Magick uses Feathers 5 for backend, which in turn uses Knex for making database queries. To migrate the database, cd to apps/server and run `npm run migrate`. 

You will need to change the `connection` property in feathers config. We will offer a better database configuration experience in the future, for now we suggest find and replacing any URLs that point to the database (ctrl f `postgresql://`)

## Self signed certificates

Developing locally, it can be very helpful to have google chrome accept all self signed cetificates coming from localhost. To do this, simply paste the following snippet into chromes URL bar and enable the feature:

`chrome://flags/#allow-insecure-localhost`

## Contributors

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/michaelsharpe"><img src="https://avatars.githubusercontent.com/u/2397603?v=4?s=100" width="100px;" alt="Michael"/><br /><sub><b>Michael</b></sub></a><br /><a href="https://github.com/Oneirocom/Magick/commits?author=michaelsharpe" title="Code">💻</a> <a href="#platform-michaelsharpe" title="Packaging/porting to new platform">📦</a> <a href="#business-michaelsharpe" title="Business development">💼</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://thenexus.city"><img src="https://avatars.githubusercontent.com/u/18633264?v=4?s=100" width="100px;" alt="M̵̞̗̝̼̅̏̎͝Ȯ̴̝̻̊̃̋̀Õ̷̼͋N̸̩̿͜ ̶̜̠̹̼̩͒"/><br /><sub><b>M̵̞̗̝̼̅̏̎͝Ȯ̴̝̻̊̃̋̀Õ̷̼͋N̸̩̿͜ ̶̜̠̹̼̩͒</b></sub></a><br /><a href="https://github.com/Oneirocom/Magick/commits?author=lalalune" title="Code">💻</a> <a href="#platform-lalalune" title="Packaging/porting to new platform">📦</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/alextitonis"><img src="https://avatars.githubusercontent.com/u/45359358?v=4?s=100" width="100px;" alt="alextitonis"/><br /><sub><b>alextitonis</b></sub></a><br /><a href="https://github.com/Oneirocom/Magick/commits?author=alextitonis" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://msub2.com"><img src="https://avatars.githubusercontent.com/u/70986246?v=4?s=100" width="100px;" alt="Daniel Adams"/><br /><sub><b>Daniel Adams</b></sub></a><br /><a href="https://github.com/Oneirocom/Magick/commits?author=msub2" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://3ov.xyz"><img src="https://avatars.githubusercontent.com/u/8985705?v=4?s=100" width="100px;" alt="Anthony Burchell"/><br /><sub><b>Anthony Burchell</b></sub></a><br /><a href="https://github.com/Oneirocom/Magick/commits?author=antpb" title="Code">💻</a> <a href="#blog-antpb" title="Blogposts">📝</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://xrdevlog.com/"><img src="https://avatars.githubusercontent.com/u/32600939?v=4?s=100" width="100px;" alt="jin"/><br /><sub><b>jin</b></sub></a><br /><a href="#blog-madjin" title="Blogposts">📝</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/sshivaditya2019"><img src="https://avatars.githubusercontent.com/u/53160903?v=4?s=100" width="100px;" alt="Shivaditya Shivganesh"/><br /><sub><b>Shivaditya Shivganesh</b></sub></a><br /><a href="https://github.com/Oneirocom/Magick/commits?author=sshivaditya2019" title="Code">💻</a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/khalildh"><img src="https://avatars.githubusercontent.com/u/16530987?v=4?s=100" width="100px;" alt="khalildh"/><br /><sub><b>khalildh</b></sub></a><br /><a href="https://github.com/Oneirocom/Magick/commits?author=khalildh" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/pigloo"><img src="https://avatars.githubusercontent.com/u/1707563?v=4?s=100" width="100px;" alt="Pigloo"/><br /><sub><b>Pigloo</b></sub></a><br /><a href="https://github.com/Oneirocom/Magick/commits?author=pigloo" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/avirtualfuture"><img src="https://avatars.githubusercontent.com/u/118632766?v=4?s=100" width="100px;" alt="avirtualfuture"/><br /><sub><b>avirtualfuture</b></sub></a><br /><a href="https://github.com/Oneirocom/Magick/commits?author=avirtualfuture" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://www.alexjorgef.com"><img src="https://avatars.githubusercontent.com/u/3478673?v=4?s=100" width="100px;" alt="Alexandre Ferreira"/><br /><sub><b>Alexandre Ferreira</b></sub></a><br /><a href="https://github.com/Oneirocom/Magick/commits?author=alexjorgef" title="Code">💻</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->
