FROM node:18-alpine
RUN apk add npm

RUN mkdir -p /usr/src/bot
WORKDIR /usr/src/bot
COPY . /usr/src/bot

RUN npm ci

CMD ["npm", "run", "start"]