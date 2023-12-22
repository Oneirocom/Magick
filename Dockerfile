FROM debian:bookworm

RUN apt update && apt install -y python3 python3-pip python3-poetry python3-virtualenv nodejs npm

RUN poetry config settings.virtualenvs.create false

COPY . /app
WORKDIR /app

RUN poetry install --no-dev

RUN npm install

ENTRYPOINT [ "npm", "run" ]
CMD [ "start-server" ]
