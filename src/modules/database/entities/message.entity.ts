import {
  BeforeInsert,
  Check,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import Email from './email.entity.js';
import TelegramChat from './telegram-chat.entity.js';

@Entity()
@Check(`NOT "email" IS NULL OR "telegramChat" IS NOT NULL`)
@Check(`"content" NOT LIKE ''`)
export default class Message {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'text' })
  content!: string;

  @Column({ type: 'datetime' })
  sentAt!: Date;

  @ManyToMany(() => Email, (email) => email.messages, { eager: true })
  @JoinTable()
  emails!: Relation<Email>[];

  @ManyToMany(() => TelegramChat, (chat) => chat.messages, { eager: true })
  @JoinTable()
  telegramChats!: Relation<TelegramChat>[];

  @BeforeInsert()
  beforeInsert() {
    this.sentAt = new Date();
  }

  get jsonObject(): Record<string, unknown> {
    return {
      content: this.content,
      sentAt: this.sentAt.toString(),
      receivers: {
        emails: this.emails.map((e) => e.email),
        telegramChats: this.telegramChats.map((c) => c.id),
      },
    };
  }
}
