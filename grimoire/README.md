## grimoire

This is currently disonnected from the main monorepo.
I understand that this is not ideal, but its for a solid reason and should be resolved soon.

Nitro is a bit unique, there are currrently errors we cannot identify without building in the framework. 
Therefore this currently builds off of the local verdaccio registry so we can start identifying these places.
It uses the exact same build system/tooling as Nitro so this should be the best starting point.
You'll notice this uses pnpm, this is to leave two options open for us to use in the future:
- continue this as its own repo within the monorepo utilizing pnpm workspaces. We know this will work if this is the case.
- integrate this as an nx package. This is the ideal solution, but nx has some issues with nitro.


## In root of monorepo repo:

```bash
# this will build all tagged packages
npm run build-release
# start the local registry
npx nx run local-registry
# this will publish ALL packages. Expect errors
npm run publish:local
```

## In this folder:

```bash
# if you haven't already, Ensure verdaccio is running with the packages published
pnpm install

# this will build everything
pnpm build

# this will run jiti on our main cli (equivalent of a user running npm grimoire dev)
pnpm dev

# you can also run the CLIs directly
pnpm grimoire dev
pnpm create-grimoire-app

# install the package globally if you want to mess around with it
npm install -g

# You can also publish the grimoire package to local registry if you prefer
pnpm release:local
```
