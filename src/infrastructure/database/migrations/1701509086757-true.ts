import { MigrationInterface, QueryRunner } from 'typeorm';

export class True1701509086757 implements MigrationInterface {
  name = 'True1701509086757';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD "google_id" character varying(100)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "google_id"`);
  }
}
