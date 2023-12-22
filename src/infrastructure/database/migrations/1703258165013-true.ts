import { MigrationInterface, QueryRunner } from 'typeorm';

export class True1703258165013 implements MigrationInterface {
  name = 'True1703258165013';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD "student_id" character varying(100)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "student_id"`);
  }
}
