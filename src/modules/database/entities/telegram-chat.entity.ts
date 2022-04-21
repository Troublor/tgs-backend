import {
  BeforeInsert,
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryColumn,
  Relation,
} from 'typeorm';
import User from './user.entity.js';
import Message from './message.entity.js';

@Entity()
export default class TelegramChat {
  @PrimaryColumn({ type: Number })
  id!: number;

  @Column({ type: 'timestamp' })
  bindAt!: Date;

  @ManyToOne(() => User, (user) => user.telegramChats, { eager: true })
  user!: Relation<User>;

  @ManyToMany(() => Message, (msg) => msg.telegramChats)
  messages!: Relation<Message>[];

  @BeforeInsert()
  beforeInsert() {
    this.bindAt = new Date();
  }
}
