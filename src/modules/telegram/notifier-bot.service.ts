import {
  BeforeApplicationShutdown,
  Inject,
  Injectable,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Telegraf } from 'telegraf';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import UserService from '../database/user.service.js';

@Injectable()
export default class NotifierBotService
  implements OnApplicationBootstrap, BeforeApplicationShutdown
{
  private readonly bot: Telegraf | undefined;
  constructor(
    private readonly configService: ConfigService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private readonly userService: UserService,
  ) {
    this.logger = logger.child({ module: 'NotifierBot' });
    const botToken = configService.get('notifier-bot.token');
    if (!botToken) {
      this.logger.warn('Notifier bot token is not set');
    } else {
      this.bot = new Telegraf(botToken);
    }
  }

  private async launch() {
    if (!this.bot) return;
    this.bot.use(async (ctx, next) => {
      this.logger.debug('Got message from telegram', {
        msg: ctx.message,
        chat: ctx.message?.chat.id,
      });
      await next(); // runs next middleware
    });

    this.bot.command('status', async (ctx) => {
      if (!ctx.message) return;
      const chatId = ctx.message.chat.id;
      const user = await this.userService.getUserByTelegramChatID(
        chatId.toString(),
      );
      if (user) {
        ctx.reply(`Current chat is linked to username: ${user.username}`);
      } else {
        ctx.reply(
          'Current chat is not linked to any username. Use /link command to link to a username.',
        );
      }
    });

    this.bot.command('link', async (ctx) => {
      if (!ctx.message) return;
      const chatId = ctx.message.chat.id;
      const args = ctx.message.text.split(/\s/).filter((s) => s.length > 0);
      if (args.length < 2) {
        ctx.reply(
          'Invalid format. Please use the format: /link <username> [<password>]',
        );
        return;
      }
      const username = args[1];
      let user = await this.userService.getUser(username);
      if (!user) {
        user = await this.userService.createUser(username);
        // create new user without password
        ctx.reply(`Username does not exist.\nCreated new user '${username}'.`);
      }
      const password = args[2];
      if (user.password && (!password || !user.verify(password))) {
        ctx.reply(`Invalid username or password`);
        return;
      }
      await this.userService.bindTelegramChat(user, chatId.toString());
      ctx.reply(`Linked current chat to username: ${username}`);
      this.logger.info(`Linked chat ${chatId} to username: ${username}`);
    });

    this.bot.command('unlink', async (ctx) => {
      if (!ctx.message) return;
      const chatId = ctx.message.chat.id;
      const user = await this.userService.getUserByTelegramChatID(
        chatId.toString(),
      );
      if (user) {
        await this.userService.unbindTelegramChat(chatId.toString(), user);
        ctx.reply(`Unlinked current chat from username: ${user.username}`);
      } else {
        ctx.reply('Current chat is not linked to any username.');
      }
    });

    const serverDomain = 'https://tgs.dns.troublor.xyz';
    this.bot.command('help', (ctx) => {
      const helpMessage = `Telegram Notification Service.
    Making it possible to programmably send telegram notifications programmatically.
Usage:
    /link current chat to a specific username. You can use any string.
    In your program running on servers, send HTTP request to the RESTful API below with the username.
    You will get notifications with the message sent from your program here!
Availability:
    The service is deployed on ${serverDomain}.
RESTful API:
    GET Method
      curl -X 'GET' ${serverDomain}/message/telegram/<username>/<message>
    POST Method
      curl -X 'POST' ${serverDomain}/message/telegram/<username> -H 'Content-Type: text/plain' -d '<message>'
Commands:
    /link <username> [<password>] - link current chat to a specific username.
                     The password is not needed if your user has not configured a password.
                     Then, you can use the RESTful API to send notification programmatically.
                     E.g., /link myId myPass
                           In any program, call the restful API, you will get notification here on Telegram.
    /status - show the username that current chat is linked to.
    /unlink - unlink current chat from username. You will not receive notification anymore.
    /help - show this usage.`;
      ctx.reply(helpMessage);
    });

    this.bot.on('text', (ctx) => {
      ctx.reply(
        `Hi ${ctx.message.from.first_name}, good to know you are here.\nPlease user command /help to check the usage.`,
      );
    });

    // launch bot
    await this.bot.launch();
  }

  async sendMessage(chatID: string, msg: string) {
    if (!this.bot) throw new Error('bot not available');
    try {
      const id = parseInt(chatID);
      await this.bot?.telegram.sendMessage(id, msg);
    } catch (e) {
      await this.bot?.telegram.sendMessage(chatID, msg);
    }
  }

  shutdown(signal?: string) {
    this.bot?.stop(signal);
  }

  async onApplicationBootstrap() {
    if (this.bot) {
      try {
        await this.launch();
        this.logger.info('Notifier bot is up and running.');
      } catch (e) {
        this.logger.error(`Failed to start bot`, {
          err: (e as Error).toString(),
        });
      }
    } else {
      this.logger.warn('Notifier bot is not initialized.');
    }
  }

  beforeApplicationShutdown(signal?: string) {
    this.shutdown(signal);
  }
}
