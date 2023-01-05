# MAGICK ML

magick is a multishot system builder. It leverages a visual coding style interface to allows game designers and developers to rapidly create powerful natural language systems and prototype games.

## Quickstart

You will need **yarn or npm** and **Docker** installed, along with **Node.js 16 or higher**. We use Docker to run a local Postgres database. You can skip the docker and install postgres directly, but you are almost always better off just using Docker.
For **Linux** and **MAC** users, **sleep** and **concurently** commands must be installed in the machine.

Install xvfb, chromium and ffmpeg

First, clone and set up magick

```
git clone https://github.com/TheNexusCity/magick
```

Next, install dependencies

```
yarn install
OR
npm i
```

You will need to make a few environment variable modifications
To keep values privates, create a new file for each .env, called .env.local (these files are safe from the .gitignore)

In order to run the client and server use

```
yarn run dev

If on Windows run:
yarn run dev:windows
```

### Local Development

We use dotenv-flow for local environment variable management

Go to client folder, and create a new file called .env.local -- copy and .env vars you want to set from .env there
If you are developing independently and are not a member of Latitude Games team, set **VITE_USE_LATITUDE=false**

Go to server folder, and create a new file called .env.local -- copy and .env vars you want to set from .env there
If you are developing independently and are not a member of Latitude Games team, set **USE_LATITUDE=false**

## Client Setup

1. Generate a [Personal Access Token](https://github.com/settings/tokens) on Github which will allow you to install private latitude packages. Make sure you check the `write:packages` option. (`read:packages` will suffice as well if you aren't planning on publishing new versions of @magickml/core)
1. In your `~/.bashrc`, append the line `export NPM_TOKEN=YourTokenGoesHere`, and restart your terminal (you can run `source ~/.bashrc` to do so)
1. Clone the repository
1. Navigate to the project root by running `cd magick`
1. Run `yarn install` to install project dependencies
1. Run `yarn start` to start the @magickml/magick-client app

## Core Local Setup

1. Core the contents of `core/.env.default` to `core/.env` and modify the secrets as necessary
1. Step 2 in Monorepo Development Setup

## Monorepo Development

Within the yarn workspace we need to be mindful of which version of the shared package @magickml/core we are including in our local development setup and our deploys to Netlify.

You can either:

1. Target a published version of [@magickml/core](https://github.com/latitudegames/magick/packages/983711) in client/package.json
2. Or actively develop against the current state of the repository. (By ensuring that client/package.json is targetting the same version of @magickml/core that is currently listed in core/package.json)

If you are testing with the Latitude API locally you can point the latitude api to your local magick package:

1.  making the dependance `"@magickml/core": "../magick/core"`
    or
2.  run `yarn link` inside '/packages/core' and then copy the command it generates for you and run that command in your root latitude api path. This will tell your latitude api to use the simlinked version of magick that your actively developing.

## @magickml/core CI

### Testing

On Pull Request, GitHub actions will first determine if the diff contains changes in the `core` directory. If so
and there isn't an active `magick-core` labelled PR already open - it will proceed with building and deploying a Canary Release
to GitHub packages. There can only be one `magick-core` labelled PR active at a time, so if one exists additional PR's will be labelled `magick-core-draft` by the CI. This `magick-core-draft` label can be removed, and the CI re-run to build a canary once the unique `magick-core` label position has been vacated.

The latest canary release can be tested and installed locally with `yarn add @magickml/core@canary`. The Netlify Deploy Preview is configured to sense `magick-core` PR's as well and targets the latest canary release, but it runs concurrently to the canary publishing process. You can test a canary release of `magick-core` on your branch's Deploy Preview by re-deploying from the Netlify UI for your branch. It is important to note that `magick-core-draft` PR's will still have a deploy preview on Netlify, but will be building with the latest canary release of `magick-core` which may be unrelated to that PR's changes until it had it's own canary release and been re-deployed.

### Releases

When a `magick-core` PR has been merged with main, the CI will create a prerelease based on the last commit, publish
@magickml/core to GitHub packages and take care of incrementing the patch version in core/package.json to prepare
for the next prerelease.

## Available Scripts

In the project directory, you can run:

### `yarn run dev`

Runs both server and client.\
Open [https://localhost:3001](https://localhost:3001) to view it in the browser.

### `yarn start`

Runs @magickml/client in the development mode.\
Open [http://localhost:3003](http://localhost:3003) to view it in the browser.

### `yarn build`

Builds the @magickml/magick-client app for production to the `client/build` folder.

### `yarn build:core`

Builds the @magickml/core package for production to the `core/build` folder.

## Apache license information

Good example here for formatting apache license files for reference.
https://www.openntf.org/Internal/home.nsf/dx/Applying_Apache_License
