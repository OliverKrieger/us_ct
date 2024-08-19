FROM node:18-alpine

WORKDIR /app

COPY package.json tsconfig.json ./
COPY src ./src

RUN yarn install
RUN yarn run build

CMD ["yarn", "start"]