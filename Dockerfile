from node:latest

COPY . /app

WORKDIR /app

RUN npm ci

EXPOSE 4200
EXPOSE 3030

CMD ["npm", "run", "dev"]
