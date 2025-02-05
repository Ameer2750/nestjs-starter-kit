FROM node:18-alpine

WORKDIR /app

COPY package.json /app/

RUN npm i -g pnpm && pnpm install

COPY . .

EXPOSE 8068

CMD [ "pnpm", "run", "start:dev" ]