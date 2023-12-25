import { MigrationInterface, QueryRunner } from 'typeorm';

export class True1703519106797 implements MigrationInterface {
  name = 'True1703519106797';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "student_classes" ADD "full_name" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "student_classes" DROP CONSTRAINT "FK_7f56b213f863785bf86e9ee5b28"`,
    );
    await queryRunner.query(
      `ALTER TABLE "student_classes" ALTER COLUMN "user_id" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "student_classes" ALTER COLUMN "student_id" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "student_classes" ADD CONSTRAINT "FK_7f56b213f863785bf86e9ee5b28" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "student_classes" DROP CONSTRAINT "FK_7f56b213f863785bf86e9ee5b28"`,
    );
    await queryRunner.query(
      `ALTER TABLE "student_classes" ALTER COLUMN "student_id" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "student_classes" ALTER COLUMN "user_id" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "student_classes" ADD CONSTRAINT "FK_7f56b213f863785bf86e9ee5b28" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "student_classes" DROP COLUMN "full_name"`,
    );
  }
}
