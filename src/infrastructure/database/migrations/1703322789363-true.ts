import { MigrationInterface, QueryRunner } from 'typeorm';

export class True1703322789363 implements MigrationInterface {
  name = 'True1703322789363';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "grade_compositions" ADD "priority" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "grade_compositions" ADD "viewable" boolean NOT NULL DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "grade_compositions" DROP COLUMN "viewable"`,
    );
    await queryRunner.query(
      `ALTER TABLE "grade_compositions" DROP COLUMN "priority"`,
    );
  }
}
