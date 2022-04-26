import {
  BeforeInsert,
  Check,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import User from './user.entity.js';
import MessageDestination from './message-destination.entity.js';

@Entity()
@Check(`"content" NOT LIKE ''`)
export default class Message {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'text' })
  content!: string;

  @Column({ type: 'timestamp' })
  sentAt!: Date;

  @ManyToOne(() => User, (user) => user.messages, { eager: true })
  receiver!: Relation<User>;

  @OneToMany(() => MessageDestination, (dist) => dist.message)
  destinations!: Relation<MessageDestination>[];

  @BeforeInsert()
  beforeInsert() {
    this.sentAt = new Date();
  }

  get jsonObject(): Record<string, unknown> {
    const emails = this.destinations
      .filter((d) => !!d.email)
      .map((d) => d.email);
    const chats = this.destinations
      .filter((d) => !!d.telegramChat)
      .map((d) => d.telegramChat);
    return {
      content: this.content,
      sentAt: this.sentAt.toString(),
      receivers: {
        emails: emails,
        telegramChats: chats,
      },
    };
  }
}
