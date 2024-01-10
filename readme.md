# UBOJNIA Discord Bot

Made with <3 and `Node.js`, `Discord.js`, `MongoDB + Mongoose.js` and `TypeScript`.

## Features

- TODO
- TODO

## Installation

#### Download

Clone repository using

> `git clone https://github.com/dzejq97/discord-bot.git`

#### Configuration

Provide `sample.env` file with database URL and Discord Token, rename it to `.env`. 
Checkout `src/config.json` and edit global settings as you like.

###### Docker build

1. Create docker image:
   
   > docker build --tag image_name .

2. Start container:
   
   > docker run -d image_name

###### Direct build

1. Install node dependencies:
   
   > `npm ci`

2. Run bot:
   
   > `npm run start`