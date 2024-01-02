import { MigrationInterface, QueryRunner } from 'typeorm';

export class True1704209989771 implements MigrationInterface {
  name = 'True1704209989771';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "avatar"`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD "avatar" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "avatar"`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD "avatar" character varying(100)`,
    );
  }
}
