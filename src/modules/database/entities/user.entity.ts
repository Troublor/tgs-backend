import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryColumn,
  Relation,
} from 'typeorm';
import Jwt from './jwt.entity.js';
import { createHash } from 'crypto';
import TelegramChat from './telegram-chat.entity.js';
import Email from './email.entity.js';
import Message from './message.entity.js';

@Entity()
export default class User {
  @PrimaryColumn({ type: String })
  username!: string;

  @Column({ type: String, nullable: true })
  password!: string | null;

  @Column({ type: 'timestamp' })
  createdAt!: Date;

  @Column({ type: 'timestamp' })
  updatedAt!: Date;

  @BeforeInsert()
  beforeInsert() {
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  @BeforeUpdate()
  beforeUpdate() {
    this.updatedAt = new Date();
  }

  @OneToMany(() => Jwt, (jwt) => jwt.user, {
    cascade: ['remove'],
  })
  jwts!: Relation<Jwt>[];

  @OneToMany(() => TelegramChat, (chat) => chat.user, {
    cascade: ['remove'],
  })
  telegramChats!: Relation<TelegramChat>[];

  @OneToMany(() => Email, (email) => email.user, {
    cascade: ['remove'],
  })
  emails!: Relation<Email>[];

  @OneToMany(() => Message, (message) => message.receiver, {
    cascade: ['remove'],
  })
  messages!: Relation<Message>[];

  static hashPassword(password: string): string {
    const hash = createHash('sha256');
    hash.update(password);
    return hash.digest('hex');
  }

  verify(password?: string): boolean {
    if (this.password) {
      return !!password && this.password === User.hashPassword(password);
    } else {
      return true;
    }
  }
}
