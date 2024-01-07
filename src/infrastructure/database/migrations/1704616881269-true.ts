import { MigrationInterface, QueryRunner } from 'typeorm';

export class True1704616881269 implements MigrationInterface {
  name = 'True1704616881269';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "classes" ADD "is_active" boolean NOT NULL DEFAULT true`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "classes" DROP COLUMN "is_active"`);
  }
}
