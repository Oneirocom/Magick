#!/bin/bash

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm

#give permission for everything in the magick directory
sudo chmod -R 777 /opt/magick

#navigate into our working directory where we have all our github files
cd /opt/magick

# install node modules
npm install

cp /etc/letsencrypt/live/magick.superreality.com/privkey.pem /opt/magick/packages/client/certs/key.pem
cp /etc/letsencrypt/live/magick.superreality.com/cert.pem /opt/magick/packages/client/certs/cert.pem

cp /etc/letsencrypt/live/magick.superreality.com/privkey.pem /opt/magick/packages/server/certs/key.pem
cp /etc/letsencrypt/live/magick.superreality.com/cert.pem /opt/magick/packages/server/certs/cert.pem

cp /opt/magick_env/server/.env /opt/magick/packages/server/.env
cp /opt/magick_env/client/.env /opt/magick/packages/client/.env
cp /opt/magick_env/core/.env /opt/magick/packages/core/.env

#start our node app in the background using PM2
# pm2 --name magick start "npm run dev"
# pm2 save
pm2 restart all
