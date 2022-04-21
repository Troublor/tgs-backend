import { Injectable } from '@nestjs/common';
import User from '../database/entities/user.entity.js';
import NotifierBotService from '../telegram/notifier-bot.service.js';
import UserService from '../database/user.service.js';

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
    for (const chat of message.telegramChats) {
      await this.notifierBotService.sendMessage(chat.id, msg);
    }
    return message.telegramChats.length;
  }
}
