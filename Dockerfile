FROM node:22-alpine3.21

WORKDIR /app

COPY package.json /app/

RUN npm i -g pnpm && pnpm install

COPY . .

EXPOSE 8090

CMD [ "pnpm", "run", "start:dev" ]