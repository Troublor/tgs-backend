import { MigrationInterface, QueryRunner } from 'typeorm';

export class url1650551621799 implements MigrationInterface {
  name = 'url1650551621799';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "url" ("key" character varying NOT NULL, "url" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL, CONSTRAINT "PK_5b61144adbd59e2664004d0b3da" PRIMARY KEY ("key"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "url"`);
  }
}
