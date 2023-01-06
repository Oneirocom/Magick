<img align="center" src="docs/logo.png" />
<h1 align="center">MAGICK ML</h1>

Magick is visual IDE for data pipelines and multimodal agents. Magick can connect to other services and comes with nodes and connectors well-suited for intelligent agents, chatbots, complex reasoning systems and realistic characters.

## Getting Started

### Prerequisites

You will need **yarn or npm** and **Docker** installed, along with **Node.js 16 or higher**. We use Docker to run a local Postgres database. You can skip the docker and install postgres directly, but you are almost always better off just using Docker.
For **Linux** and **MAC** users, **sleep** and **concurently** commands must be installed in the machine.

You may need to install `xvfb, chromium and ffmpeg` for features like browser integration and text to speech.

### Installation

First, clone and set up magick

```
git clone https://github.com/Oneirocom/MagickML
```

Next, install dependencies

```
yarn install
```

Now, copy the `.env.example` file and rename it to `.env` -- you can store secrets and environment variables here. This is git ignored but make sure you don't accidentally reveal this in your public repo!

That's it, you're installed. In order to run the client and server use this quickstart command:

```
yarn dev
```

You can also start the parts up individually. In order, start `containers`, then `apps`, then if you'd like live agents, also run `entities`. All three are covered by the `yarn dev`.

## Apache license information

Good example here for formatting apache license files for reference.
https://www.openntf.org/Internal/home.nsf/dx/Applying_Apache_License
