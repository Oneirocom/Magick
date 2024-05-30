FROM magickml/magick:latest as development

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps --ignore-scripts

COPY . .
RUN npm run dev:server

FROM magickml/magick:latest as production

ARG GITHUB_TOKEN
ARG BRANCH=development

ARG RAILWAY_GIT_COMMIT_SHA
# Configure git to use the token
RUN git config --global url."https://${GITHUB_TOKEN}@github.com/".insteadOf "https://github.com/"
RUN git clone --branch ${BRANCH} --depth 1 https://www.github.com/oneirocom/magick.git /app

WORKDIR /app

# Clone the submodule
RUN git submodule update --init --recursive portal/cloud

# RUN poetry install --no-root

RUN npm install

RUN npm run build-server

ENTRYPOINT [ "npm", "run" ]
CMD [ "start-server" ]