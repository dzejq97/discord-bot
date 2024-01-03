# AIO Ubojnia Discord Bot
Made with Node.js, Discord.js, Prisma and TypeScript

## Features
### Moderation system
- !mute
- !unmute
- !kick
- !ban
### Leveling and reputation(not finished)
- Leveling working but not finished
- Reputation points finished.
Detects message replies and mentions, and triggered by message contents `+rep`, `-rep`, `+1`, `-1`.
Example:
> `+1 @mention`
or
> `+1` as message reply

## Installation
1. Clone repository:
> `git clone https://github.com/dzejq97/discord-bot.git`

2. Install dependencies:
> `npm ci`

3. Configuration:
> Edit and rename `template.config.json` to `config.json` at `./src`.

> Edit and rename `template.env` to `.env` at `./`

4. Start with:
> `npm run start`


## TO DO:
- [x] Moderation
- [ ] Economy
- [ ] Role-Reactions/Verifications
- [ ] Tickets
- [ ] Leveling
- and much more...

Detailed TODO's in GitHub issues