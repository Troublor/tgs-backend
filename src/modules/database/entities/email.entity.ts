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
export default class Email {
  @PrimaryColumn({ type: String })
  email!: string;

  @Column({ type: Boolean, default: false })
  verified!: boolean;

  @Column({ type: 'timestamp' })
  bindAt!: Date;

  @ManyToOne(() => User, (user) => user.emails, { eager: true })
  user!: Relation<User>;

  @OneToMany(() => MessageDestination, (dist) => dist.email)
  mapToMessages!: Relation<MessageDestination>[];

  @BeforeInsert()
  beforeInsert() {
    this.bindAt = new Date();
  }
}
