import { MigrationInterface, QueryRunner } from 'typeorm';

export class True1704513756502 implements MigrationInterface {
  name = 'True1704513756502';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "grade_reviews" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "assignment_id" integer NOT NULL, "student_id" character varying NOT NULL, "teacher_id" integer NOT NULL, "value" integer NOT NULL, "expected_value" integer NOT NULL, "message" character varying NOT NULL, CONSTRAINT "PK_2a571004530b224b5556331c127" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "grade_reviews" ADD CONSTRAINT "FK_06555111b13d12302970bd64d2b" FOREIGN KEY ("teacher_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "grade_reviews" ADD CONSTRAINT "FK_729a75302f9510734e6f2f31844" FOREIGN KEY ("assignment_id") REFERENCES "assignments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "grade_reviews" DROP CONSTRAINT "FK_729a75302f9510734e6f2f31844"`,
    );
    await queryRunner.query(
      `ALTER TABLE "grade_reviews" DROP CONSTRAINT "FK_06555111b13d12302970bd64d2b"`,
    );
    await queryRunner.query(`DROP TABLE "grade_reviews"`);
  }
}
