import {
  BeforeApplicationShutdown,
  Inject,
  Injectable,
  NotFoundException,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Telegraf } from 'telegraf';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import UserChatMapService, { UserId } from './user-chat-map.service';

@Injectable()
export default class NotifierBotService
  implements OnApplicationBootstrap, BeforeApplicationShutdown
{
  private readonly bot: Telegraf;
  constructor(
    private readonly configService: ConfigService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private readonly userChatMap: UserChatMapService,
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
    this.bot.use(async (ctx, next) => {
      this.logger.debug('Got message from telegram', {
        msg: ctx.message,
        chat: ctx.message?.chat.id,
      });
      await next(); // runs next middleware
    });

    this.bot.command('status', (ctx) => {
      if (!ctx.message) return;
      const chatId = ctx.message.chat.id;
      if (this.userChatMap.hasChat(chatId)) {
        ctx.reply(
          `Current chat is linked to userId: ${this.userChatMap.getUser(
            chatId,
          )}`,
        );
      } else {
        ctx.reply(
          'Current chat is not linked to any userId. Use /link command to link to a userId.',
        );
      }
    });

    this.bot.command('link', (ctx) => {
      if (!ctx.message) return;
      const chatId = ctx.message.chat.id;
      const args = ctx.message.text.split(/\s/).filter((s) => s.length > 0);
      if (args.length < 2) {
        ctx.reply('Invalid format. Please use the format: /link <userId>');
        return;
      }
      const userId = args[1];
      this.userChatMap.addChat(chatId, userId);
      ctx.reply(`Linked current chat to userId: ${userId}`);
      this.logger.info(`Linked chat ${chatId} to userId: ${userId}`);
    });

    this.bot.command('unlink', (ctx) => {
      if (!ctx.message) return;
      const chatId = ctx.message.chat.id;
      if (this.userChatMap.hasChat(chatId)) {
        const userId = this.userChatMap.getUser(chatId);
        this.userChatMap.deleteChat(chatId);
        ctx.reply(`Unlinked current chat from userId: ${userId}`);
      } else {
        ctx.reply('Current chat is not linked to any userId.');
      }
    });

    const serverDomain = 'https://troublor.xyz';
    this.bot.command('help', (ctx) => {
      const helpMessage = `Telegram Notification Service.
    Making it possible to programmably send telegram notifications programmatically. 
Usage: 
    /link current chat to a specific userId. You can use any string.
    In your program running on servers, send HTTP request to the RESTful API below with the userId. 
    You will get notifications with the message sent from your program here!
Availability: 
    The service is deployed on ${serverDomain}.
RESTful API:
    GET Method
      curl -X 'GET' ${serverDomain}/telegram/notify/<userId>/<message>
    POST Method
      curl -X 'POST' ${serverDomain}/telegram/notify/<userId> -H 'Content-Type: text/plain' -d '<message>'
Commands: 
    /link <userId> - link current chat to a specific userId.
                     You can use the RESTful API to send notification programmatically.
                     E.g., /link myId
                           In any program, call the restful API, you will get notification here on Telegram.
    /status - show the userId that current chat is linked to.
    /unlink - unlink current chat from userId. You will not receive notification anymore.
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

  sendMessage(userId: UserId, msg: string) {
    const chats = this.userChatMap.getChats(userId);
    if (chats.length <= 0) {
      throw new NotFoundException('no chat available to send message');
    }
    for (const chat of chats) {
      this.bot.telegram
        .sendMessage(chat, msg)
        .then(() => {
          this.logger.debug(
            `Sent message to user '${userId}': to=${chat} msg=${msg}`,
          );
        })
        .catch((e) => {
          this.logger.error(
            `Failed to send message to user '${userId}': ${e.toString()}`,
          );
        });
    }
    this.logger.info(`Served notification of user '${userId}': ${msg}`);
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
        this.logger.error(`Failed to start bot`, { err: e.toString() });
      }
    } else {
      this.logger.warn('Notifier bot is not initialized.');
    }
  }

  beforeApplicationShutdown(signal?: string) {
    this.shutdown(signal);
  }
}
