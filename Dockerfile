FROM debian:bookworm

RUN apt update && apt install -y python3 python3-pip python3-virtualenv python3-poetry nodejs npm

# RUN poetry config settings.virtualenvs.create false
RUN poetry config installer.max-workers 10


COPY . /app
WORKDIR /app

RUN poetry install --no-interaction --no-ansi -vvv
# RUN poetry install --no-root

RUN npm install

ENTRYPOINT [ "npm", "run" ]
CMD [ "start-server" ]