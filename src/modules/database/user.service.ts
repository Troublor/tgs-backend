import { AppData } from './data-source.js';
import { Injectable } from '@nestjs/common';
import User from './entities/user.entity.js';
import { DeleteResult, Repository } from 'typeorm';
import TelegramChat from './entities/telegram-chat.entity.js';
import Email from './entities/email.entity.js';
import Message from './entities/message.entity.js';

@Injectable()
export default class UserService {
  readonly userRepo: Repository<User>;
  readonly telegramChatRepo: Repository<TelegramChat>;
  readonly emailRepo: Repository<Email>;
  readonly messageRepo: Repository<Message>;

  constructor() {
    this.userRepo = AppData.getRepository(User);
    this.telegramChatRepo = AppData.getRepository(TelegramChat);
    this.emailRepo = AppData.getRepository(Email);
    this.messageRepo = AppData.getRepository(Message);
  }

  async getUser(username: string): Promise<User | null> {
    return await this.userRepo.findOne({ where: { username: username } });
  }

  async createUser(username: string, password: string): Promise<User> {
    const user = this.userRepo.create({
      username: username,
      password: User.hashPassword(password),
    });
    await this.userRepo.save(user);
    return user;
  }

  async bindTelegramChat(user: User, chatID: number): Promise<TelegramChat> {
    const chat = this.telegramChatRepo.create({
      id: chatID,
      user: user,
    });
    await this.telegramChatRepo.save(chat);
    return chat;
  }

  async bindEmail(user: User, email: string): Promise<Email> {
    const emailEntity = this.emailRepo.create({
      email: email,
      user: user,
    });
    await this.emailRepo.save(emailEntity);
    return emailEntity;
  }

  async unbindTelegramChat(chatID: number, user?: User): Promise<boolean> {
    let r: DeleteResult;
    if (user) {
      r = await this.telegramChatRepo.delete({
        id: chatID,
        user: { username: user.username },
      });
    } else {
      r = await this.telegramChatRepo.delete(chatID);
    }
    return !!r.affected && r.affected > 0;
  }

  async unbindEmail(email: string, user?: User): Promise<boolean> {
    let r: DeleteResult;
    if (user) {
      r = await this.emailRepo.delete({
        email: email,
        user: { username: user.username },
      });
    } else {
      r = await this.emailRepo.delete(email);
    }
    return !!r.affected && r.affected > 0;
  }

  async saveMessage(
    user: User,
    message: string,
    { email = false, telegramChat = false },
  ): Promise<Message> {
    if (!email && !telegramChat)
      throw new Error('cannot send message to nowhere');
    const msg = this.messageRepo.create({
      content: message,
    });
    const userWithRelations = await this.userRepo.findOne({
      where: {
        username: user.username,
      },
      relations: {
        emails: true,
        telegramChats: true,
      },
    });
    if (!userWithRelations) throw new Error('user not found');
    if (email) msg.emails = [...userWithRelations.emails];
    if (telegramChat) msg.telegramChats = [...userWithRelations.telegramChats];
    await this.messageRepo.save(msg);
    return msg;
  }

  async getMessages(
    user: User,
    { email = false, telegramChat = false },
  ): Promise<Message[]> {
    const userWithRelations = await this.userRepo.findOne({
      where: { username: user.username },
      relations: {
        emails: email
          ? {
              messages: true,
            }
          : false,
        telegramChats: telegramChat
          ? {
              messages: true,
            }
          : false,
      },
    });
    const messages: Message[] = [];
    if (!userWithRelations) return messages;
    if (email) {
      messages.push(
        ...userWithRelations.emails.reduce(
          (acc, e) => acc.concat(e.messages),
          [] as Message[],
        ),
      );
    }
    if (telegramChat) {
      messages.push(
        ...userWithRelations.telegramChats.reduce(
          (acc, e) => acc.concat(e.messages),
          [] as Message[],
        ),
      );
    }
    return messages;
  }

  async getUserByTelegramChatID(chatID: number): Promise<User | null> {
    const chat = await this.telegramChatRepo.findOne({
      where: {
        id: chatID,
      },
      relations: {
        user: true,
      },
    });
    if (!chat) return null;
    return chat.user;
  }
}
