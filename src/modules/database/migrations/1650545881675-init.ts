import { MigrationInterface, QueryRunner } from 'typeorm';

export class init1650545881675 implements MigrationInterface {
  name = 'init1650545881675';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "jwt" ("token" character varying NOT NULL, "description" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL, "expireAt" TIMESTAMP, "userUsername" character varying, CONSTRAINT "PK_77c04766b3af10daff511d591b2" PRIMARY KEY ("token"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "email" ("email" character varying NOT NULL, "verified" boolean NOT NULL DEFAULT false, "bindAt" TIMESTAMP NOT NULL, "userUsername" character varying, CONSTRAINT "PK_fee9013b697946e8129caba8983" PRIMARY KEY ("email"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "message" ("id" SERIAL NOT NULL, "content" text NOT NULL, "sentAt" TIMESTAMP NOT NULL, CONSTRAINT "CHK_e988c4be6ba62c45b347b5c1bb" CHECK ("content" NOT LIKE ''), CONSTRAINT "PK_ba01f0a3e0123651915008bc578" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "telegram_chat" ("id" integer NOT NULL, "bindAt" TIMESTAMP NOT NULL, "userUsername" character varying, CONSTRAINT "PK_a04a0a4688d1b7b633bee34ae34" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("username" character varying NOT NULL, "password" character varying NOT NULL, "requireAuth" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL, "updatedAt" TIMESTAMP NOT NULL, CONSTRAINT "PK_78a916df40e02a9deb1c4b75edb" PRIMARY KEY ("username")); COMMENT ON COLUMN "user"."requireAuth" IS 'require authentication'`,
    );
    await queryRunner.query(
      `CREATE TABLE "message_emails_email" ("messageId" integer NOT NULL, "emailEmail" character varying NOT NULL, CONSTRAINT "PK_1a689c63dd8e1c945112102a9cd" PRIMARY KEY ("messageId", "emailEmail"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_5a32c7de0318b793675bc35394" ON "message_emails_email" ("messageId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_bfacf9abf272f8ad166b3f79c0" ON "message_emails_email" ("emailEmail") `,
    );
    await queryRunner.query(
      `CREATE TABLE "message_telegram_chats_telegram_chat" ("messageId" integer NOT NULL, "telegramChatId" integer NOT NULL, CONSTRAINT "PK_3e03d74d231c6c9c6e98a391bbb" PRIMARY KEY ("messageId", "telegramChatId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_088c3a32e9840616aadaf0d6b8" ON "message_telegram_chats_telegram_chat" ("messageId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_b7b310d46ddeb5d0a38168a6a4" ON "message_telegram_chats_telegram_chat" ("telegramChatId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "jwt" ADD CONSTRAINT "FK_60e341d8243332dc317b76379ae" FOREIGN KEY ("userUsername") REFERENCES "user"("username") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "email" ADD CONSTRAINT "FK_b212a1234776f77ee42684c2774" FOREIGN KEY ("userUsername") REFERENCES "user"("username") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "telegram_chat" ADD CONSTRAINT "FK_00b6e19b1b42cdb10f231bdd02f" FOREIGN KEY ("userUsername") REFERENCES "user"("username") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "message_emails_email" ADD CONSTRAINT "FK_5a32c7de0318b793675bc35394e" FOREIGN KEY ("messageId") REFERENCES "message"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "message_emails_email" ADD CONSTRAINT "FK_bfacf9abf272f8ad166b3f79c0f" FOREIGN KEY ("emailEmail") REFERENCES "email"("email") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "message_telegram_chats_telegram_chat" ADD CONSTRAINT "FK_088c3a32e9840616aadaf0d6b87" FOREIGN KEY ("messageId") REFERENCES "message"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "message_telegram_chats_telegram_chat" ADD CONSTRAINT "FK_b7b310d46ddeb5d0a38168a6a48" FOREIGN KEY ("telegramChatId") REFERENCES "telegram_chat"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "message_telegram_chats_telegram_chat" DROP CONSTRAINT "FK_b7b310d46ddeb5d0a38168a6a48"`,
    );
    await queryRunner.query(
      `ALTER TABLE "message_telegram_chats_telegram_chat" DROP CONSTRAINT "FK_088c3a32e9840616aadaf0d6b87"`,
    );
    await queryRunner.query(
      `ALTER TABLE "message_emails_email" DROP CONSTRAINT "FK_bfacf9abf272f8ad166b3f79c0f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "message_emails_email" DROP CONSTRAINT "FK_5a32c7de0318b793675bc35394e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "telegram_chat" DROP CONSTRAINT "FK_00b6e19b1b42cdb10f231bdd02f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "email" DROP CONSTRAINT "FK_b212a1234776f77ee42684c2774"`,
    );
    await queryRunner.query(
      `ALTER TABLE "jwt" DROP CONSTRAINT "FK_60e341d8243332dc317b76379ae"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_b7b310d46ddeb5d0a38168a6a4"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_088c3a32e9840616aadaf0d6b8"`,
    );
    await queryRunner.query(
      `DROP TABLE "message_telegram_chats_telegram_chat"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_bfacf9abf272f8ad166b3f79c0"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_5a32c7de0318b793675bc35394"`,
    );
    await queryRunner.query(`DROP TABLE "message_emails_email"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "telegram_chat"`);
    await queryRunner.query(`DROP TABLE "message"`);
    await queryRunner.query(`DROP TABLE "email"`);
    await queryRunner.query(`DROP TABLE "jwt"`);
  }
}
