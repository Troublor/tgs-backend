import {
  BeforeInsert,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  Relation,
} from 'typeorm';
import User from './user.entity.js';
import MessageDestination from './message-destination.entity.js';

@Entity()
export default class TelegramChat {
  @PrimaryColumn({ type: String })
  id!: string;

  @Column({ type: 'timestamp' })
  bindAt!: Date;

  @ManyToOne(() => User, (user) => user.telegramChats, { eager: true })
  user!: Relation<User>;

  @OneToMany(() => MessageDestination, (dist) => dist.email)
  mapToMessages!: Relation<MessageDestination>[];

  @BeforeInsert()
  beforeInsert() {
    this.bindAt = new Date();
  }
}
