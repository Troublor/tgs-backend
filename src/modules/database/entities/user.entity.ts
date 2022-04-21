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

@Entity()
export default class User {
  @PrimaryColumn({ type: String })
  username!: string;

  @Column({ type: String })
  password!: string;

  @Column({
    type: Boolean,
    default: false,
    comment: 'require authentication',
  })
  requireAuth!: boolean;

  @Column({ type: 'datetime' })
  createdAt!: Date;

  @Column({ type: 'datetime' })
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

  static hashPassword(password: string): string {
    const hash = createHash('sha256');
    hash.update(password);
    return hash.digest('hex');
  }

  verify(password: string): boolean {
    return this.password === User.hashPassword(password);
  }
}
