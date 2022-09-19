# Monorepo refactor

All packages are linked through a simple mechanism (\* or a file:../packageName)
Packages build into a root 'build/packages' folder
Lerna is set up to publish from this build packages folder
