![Logo](https://github.com/tryshchenko/js-news-bot/raw/master/icon.png)
# JS Ambassador Bot - JS News to Telegram Channel
WIP.
The most critical todos:
- Error handling
- Tests
- Some security for "Bypass" function
- More parsers
- Better documentation.

## TL;DR
This bot parses websites with javascript news and delivers them to telegram channel.
https://t.me/js_amb - join JS Ambassador channel on the telegram to subscribe to that news.

## Reasons
RSS isn't a case anymore. We want to get rapid notifications from websites. Even from those - who has not provided us a possibility to do so.

## Running
1. Register your bot with @botfather. It will give you a token
2. Create a channel. Make sure it's public.
3. Add bot as an admin to the channel
2. Create token file: `cp config-example.js config.js`
3. Setup and configure MongoDB
3. Put your actual data into configuration file
4. `npm install`
5. `npm start`
6. Enjoy. Just type your bot a message in the telegram

## TIPs
You have bot and channel. Users can write to bot, and the message will be transferred to the channel. It will allow everyone to share something. Also, there is a simple algorithm to prevent users from posting *very* often. It's POC; function requires improvements from the security perspective.

## Architecture
Some highlights:
- Two entities: Engine which cares about initialization and "kinda" DI. Parsers which are called by engine every XXX(configurable) seconds. Parser get's HTML parses it and prepares a text message.
- Telegram API is injected by the Engine to every parser.
- Parsers don't know anything about the Engine and other parsers either. It allows them to be exported as an npm module.
- The Engine is also agnostic. The idea to export it into the separate npm module after stabilization.
- Parsers extend `BaseParser` class which does most of the boring job.
- It is not required for every parser, but most of them will need a database. DB is important to keep track what have we already sent and what should too. There is a handle record into `BaseParser`;
- We don't have interfaces in js - so it's going to be a convention for a while: every parser **should** implement `getAlias` and `parse` method. The Engine automatically triggers them.

> Every time ask yourself a question: 
> "Can my parser be exported as an independent module?" 

Such an approach will help us a lot to scale it.

## Contribution
Everyone is welcome, feel free to open a PR.
To simplify development, you will need to do two steps:
- Create your own channel for testing
- Register your own bot with @botfather for testing

It definitely makes sense to consider some option to test locally without telegram integration, but now I have no such experience. If you have - feel free to suggest.

## Credentials
Icon used for application was taken here https://www.flaticon.com/authors/smashicons

### Thank you for checking this page.
