import { MigrationInterface, QueryRunner } from 'typeorm';

export class True1704517957135 implements MigrationInterface {
  name = 'True1704517957135';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "grade_reviews" ADD "is_reviewed" boolean NOT NULL DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "grade_reviews" DROP COLUMN "is_reviewed"`,
    );
  }
}
