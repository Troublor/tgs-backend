import { MigrationInterface, QueryRunner } from 'typeorm';

export class init1650947776445 implements MigrationInterface {
  name = 'init1650947776445';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "jwt" ("token" character varying NOT NULL, "description" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL, "expireAt" TIMESTAMP, "userUsername" character varying, CONSTRAINT "PK_77c04766b3af10daff511d591b2" PRIMARY KEY ("token"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "message" ("id" SERIAL NOT NULL, "content" text NOT NULL, "sentAt" TIMESTAMP NOT NULL, "receiverUsername" character varying, CONSTRAINT "CHK_e988c4be6ba62c45b347b5c1bb" CHECK ("content" NOT LIKE ''), CONSTRAINT "PK_ba01f0a3e0123651915008bc578" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "email" ("email" character varying NOT NULL, "verified" boolean NOT NULL DEFAULT false, "bindAt" TIMESTAMP NOT NULL, "userUsername" character varying, CONSTRAINT "PK_fee9013b697946e8129caba8983" PRIMARY KEY ("email"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "message_destination" ("id" SERIAL NOT NULL, "messageId" integer, "emailEmail" character varying, "telegramChatId" character varying, CONSTRAINT "PK_9a0f79a383cf582a46bebc5ab9f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "telegram_chat" ("id" character varying NOT NULL, "bindAt" TIMESTAMP NOT NULL, "userUsername" character varying, CONSTRAINT "PK_a04a0a4688d1b7b633bee34ae34" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("username" character varying NOT NULL, "password" character varying, "createdAt" TIMESTAMP NOT NULL, "updatedAt" TIMESTAMP NOT NULL, CONSTRAINT "PK_78a916df40e02a9deb1c4b75edb" PRIMARY KEY ("username"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "url" ("key" character varying NOT NULL, "url" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL, CONSTRAINT "PK_5b61144adbd59e2664004d0b3da" PRIMARY KEY ("key"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "jwt" ADD CONSTRAINT "FK_60e341d8243332dc317b76379ae" FOREIGN KEY ("userUsername") REFERENCES "user"("username") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "message" ADD CONSTRAINT "FK_838b22ffd982823818680c50064" FOREIGN KEY ("receiverUsername") REFERENCES "user"("username") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "email" ADD CONSTRAINT "FK_b212a1234776f77ee42684c2774" FOREIGN KEY ("userUsername") REFERENCES "user"("username") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "message_destination" ADD CONSTRAINT "FK_479f2dfa552515cbcfaa21f8e24" FOREIGN KEY ("messageId") REFERENCES "message"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "telegram_chat" ADD CONSTRAINT "FK_00b6e19b1b42cdb10f231bdd02f" FOREIGN KEY ("userUsername") REFERENCES "user"("username") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "telegram_chat" DROP CONSTRAINT "FK_00b6e19b1b42cdb10f231bdd02f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "message_destination" DROP CONSTRAINT "FK_479f2dfa552515cbcfaa21f8e24"`,
    );
    await queryRunner.query(
      `ALTER TABLE "email" DROP CONSTRAINT "FK_b212a1234776f77ee42684c2774"`,
    );
    await queryRunner.query(
      `ALTER TABLE "message" DROP CONSTRAINT "FK_838b22ffd982823818680c50064"`,
    );
    await queryRunner.query(
      `ALTER TABLE "jwt" DROP CONSTRAINT "FK_60e341d8243332dc317b76379ae"`,
    );
    await queryRunner.query(`DROP TABLE "url"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "telegram_chat"`);
    await queryRunner.query(`DROP TABLE "message_destination"`);
    await queryRunner.query(`DROP TABLE "email"`);
    await queryRunner.query(`DROP TABLE "message"`);
    await queryRunner.query(`DROP TABLE "jwt"`);
  }
}
