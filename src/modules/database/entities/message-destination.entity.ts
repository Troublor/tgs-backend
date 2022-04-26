import { Entity, ManyToOne, PrimaryGeneratedColumn, Relation } from 'typeorm';
import Message from './message.entity.js';
import Email from './email.entity.js';
import TelegramChat from './telegram-chat.entity.js';

@Entity()
export default class MessageDestination {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Message, (msg) => msg.destinations, {
    eager: true,
  })
  message!: Relation<Message>;

  @ManyToOne(() => Email, (email) => email.mapToMessages, {
    eager: true,
    nullable: true,
    createForeignKeyConstraints: false,
  })
  email!: Relation<Email> | null;

  @ManyToOne(() => TelegramChat, (chat) => chat.mapToMessages, {
    eager: true,
    nullable: true,
    createForeignKeyConstraints: false,
  })
  telegramChat!: Relation<TelegramChat> | null;
}
