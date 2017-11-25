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
https://t.me/js_amb - joing JS Ambassador channel on telegram to subscribe to those news.

## Reasons
RSS isn't a case anymore. We want to get rapid notifications from websites. Even from those - who has not provided us a possibility to.

## Running
1. Register your bot with @botfather. It will give you a token
2. Create a channel. Make sure it's public.
3. Add bot as an admin to the channel
2. Create token file: `cp config-example.js config.js`
3. Setup and configure mongodb
3. Put your actual data into configuration file
4. `npm install`
5. `npm start`
6. Enjoy. Just type your bot a message in telegram

## TIPs
You have bot and channel. Users can write to bot and the message will be transfered to the channel. It will allow everyone to share something. Also there is an simple algorithm to prevent users from posting *very* often. It's POC, function requires improvements from security perspective.

## Architecture
Some highlights:
- Two entities: Engine which cares about initialization and "kinda" DI. Parsers which are called by engine every XXX(configurable) seconds. Parser get's html, parses it and prepares a text message.
- Telegram API is injected by engine to every parser.
- Parsers doesn't know anything about engine and about other parsers either. It allows them to be exported as an npm module.
- Engine is also agnostic. The idea to export it into the separate npm module after stabilization.
- Parsers extends `BaseParser` class which does most of the boring job.
- It is not required for every parser, but most of them will need a database. This is important to keep track what have we already sent and what should to. There is a handle record into `BaseParser`;
- We don't have interfaces in js - so it's going to be a convention for a while: every parser **should** implement `getAlias` and `parse` method. They are automatically triggered by engine.

> Every time ask youself a question: 
> "Can my parser be exported as an independent module?" 

Such an approach will help us a lot to scale it.

## Contribution
Everyone is welcome, feel free to open a PR.
To simplify development you will need to do 2 steps:
- Create your own channel for testing
- Register your own bot with @botfather for testing

It's definitely makes sense to consider some option to test locally without telegram integration, but now I have no such experience. If you have - feel free to suggest.

## Credentials
Icon used for application was taken here https://www.flaticon.com/authors/smashicons

### Thank you for checking this page.
