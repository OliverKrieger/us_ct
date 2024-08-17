FROM node:16-alpine

WORKDIR /app

COPY package.json tsconfig.json ./
COPY src ./src

RUN yarn install
RUN yarn run build

EXPOSE 8080

CMD ["yarn", "start"]
