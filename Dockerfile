FROM node:18-alpine
RUN mkdir -p /usr/bot
WORKDIR /usr/bot
COPY .env /usr/bot
COPY package*.json /usr/bot
RUN npm i
COPY . /usr/bot/
CMD [ "npm", "run", "deploy" ]