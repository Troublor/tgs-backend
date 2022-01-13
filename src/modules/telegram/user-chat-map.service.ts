import * as fs from 'fs';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export type ChatId = number | string;
export type UserId = string;

@Injectable()
export default class UserChatMapService {
  private readonly mapping: Record<UserId, ChatId[]> = {}; // from userId to chatId list

  constructor(private configService: ConfigService) {
    const userChatMapFile = this.configService.get<string>(
      'notifier-bot.userChatMap',
    ) as string;
    if (fs.existsSync(userChatMapFile)) {
      this.mapping = JSON.parse(
        fs.readFileSync(userChatMapFile, { encoding: 'utf-8' }),
      );
    } else {
      this.mapping = {};
    }
  }

  hasUser(userId: UserId): boolean {
    return userId in this.mapping;
  }

  register(userId: UserId): void {
    if (this.hasUser(userId)) {
      return;
    }
    this.mapping[userId] = [];
    this.save();
  }

  getChats(userId: UserId): ChatId[] {
    if (!this.hasUser(userId)) {
      return [];
    }
    return this.mapping[userId];
  }

  hasChat(chatId: ChatId, userId?: UserId): boolean {
    if (userId) {
      return this.getChats(userId).some((c) => c === chatId);
    } else {
      for (const u of Object.keys(this.mapping)) {
        if (this.hasChat(chatId, u)) return true;
      }
      return false;
    }
  }

  deleteChat(chatId: ChatId): void {
    for (const u of Object.keys(this.mapping)) {
      this.mapping[u] = this.mapping[u].filter((c) => c !== chatId);
    }
    this.save();
  }

  addChat(chatId: ChatId, userId: UserId): void {
    if (!this.hasUser(userId)) {
      this.register(userId);
    }
    if (this.hasChat(chatId, userId)) return;
    else {
      this.deleteChat(chatId);
      this.mapping[userId].push(chatId);
    }
    this.save();
  }

  getUser(chatId: ChatId): string {
    for (const u of Object.keys(this.mapping)) {
      if (this.getChats(u).some((c) => c === chatId)) {
        return u;
      }
    }
    throw new Error('not found');
  }

  save(): void {
    const userChatMapFile = this.configService.get<string>(
      'notifier-bot.userChatMap',
    ) as string;
    fs.writeFileSync(userChatMapFile, JSON.stringify(this.mapping));
  }
}
