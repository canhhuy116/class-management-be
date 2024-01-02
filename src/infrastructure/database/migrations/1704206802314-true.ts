import { MigrationInterface, QueryRunner } from 'typeorm';

export class True1704206802314 implements MigrationInterface {
  name = 'True1704206802314';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD "studentId" character varying(100)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "studentId"`);
  }
}
