import { MigrationInterface, QueryRunner } from 'typeorm';

export class True1701528309543 implements MigrationInterface {
  name = 'True1701528309543';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD "facebook_id" character varying(100)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "facebook_id"`);
  }
}
