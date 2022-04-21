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
export default class Email {
  @PrimaryColumn({ type: String })
  email!: string;

  @Column({ type: Boolean, default: false })
  verified!: boolean;

  @Column({ type: 'datetime' })
  bindAt!: Date;

  @ManyToOne(() => User, (user) => user.emails, { eager: true })
  user!: Relation<User>;

  @ManyToMany(() => Message, (msg) => msg.telegramChats)
  messages!: Relation<Message>[];

  @BeforeInsert()
  beforeInsert() {
    this.bindAt = new Date();
  }
}
