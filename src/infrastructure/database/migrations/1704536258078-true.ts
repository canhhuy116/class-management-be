import { MigrationInterface, QueryRunner } from 'typeorm';

export class True1704536258078 implements MigrationInterface {
  name = 'True1704536258078';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "grade_reviews" ADD "comment_approve" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "grade_reviews" ADD "comment_reject" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "grade_reviews" DROP COLUMN "comment_reject"`,
    );
    await queryRunner.query(
      `ALTER TABLE "grade_reviews" DROP COLUMN "comment_approve"`,
    );
  }
}
