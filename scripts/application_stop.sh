#!/bin/bash

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm
#Stopping existing node servers

echo "Stopping any thoth node servers"
#pm2 stop all > /dev/null 2>&1