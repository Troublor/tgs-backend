import {
  BeforeInsert,
  Column,
  Entity,
  ManyToOne,
  PrimaryColumn,
  Relation,
} from 'typeorm';
import User from './user.entity.js';

@Entity()
export default class Jwt {
  @PrimaryColumn({ type: String })
  token!: string;

  @Column({ type: String })
  description!: string;

  @Column({ type: 'datetime' })
  createdAt!: Date;

  @Column({ type: 'datetime', nullable: true })
  expireAt!: Date | null; // null mean no expire time

  @BeforeInsert()
  beforeInsert() {
    this.createdAt = new Date();
  }

  @ManyToOne(() => User, (user) => user.jwts)
  user!: Relation<User>;

  get jsonObject(): Record<string, unknown> {
    return {
      token: this.token,
      description: this.description,
      createdAt: this.createdAt.toString(),
      expireAt: this.expireAt ? this.expireAt.toString() : 'never',
    };
  }
}
