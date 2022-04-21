import { BeforeInsert, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export default class Url {
  @PrimaryColumn()
  key!: string;

  @Column({ type: String })
  url!: string;

  @Column({ type: 'timestamp' })
  createdAt!: Date;

  @BeforeInsert()
  beforeInsert() {
    this.createdAt = new Date();
  }

  get jsonObject(): Record<string, unknown> {
    return {
      key: this.key,
      url: this.url,
      createdAt: this.createdAt.toString(),
    };
  }
}
