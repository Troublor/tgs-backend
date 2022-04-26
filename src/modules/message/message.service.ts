import { Injectable } from '@nestjs/common';
import User from '../database/entities/user.entity.js';
import NotifierBotService from '../telegram/notifier-bot.service.js';
import UserService from '../database/user.service.js';
import TelegramChat from '../database/entities/telegram-chat.entity.js';

@Injectable()
export default class MessageService {
  constructor(
    private readonly notifierBotService: NotifierBotService,
    private readonly userService: UserService,
  ) {}
  async broadcastMessageToTelegram(user: User, msg: string): Promise<number> {
    const message = await this.userService.saveMessage(user, msg, {
      telegramChat: true,
    });
    const destinations = message.destinations.filter((d) => !!d.telegramChat);
    for (const dest of destinations) {
      await this.notifierBotService.sendMessage(
        (dest.telegramChat as TelegramChat).id,
        msg,
      );
    }
    return destinations.length;
  }
}
