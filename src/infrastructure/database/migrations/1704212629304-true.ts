import { MigrationInterface, QueryRunner } from 'typeorm';

export class True1704212629304 implements MigrationInterface {
  name = 'True1704212629304';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "grades" DROP CONSTRAINT "FK_ad57529b4f66366028845513306"`,
    );
    await queryRunner.query(
      `ALTER TABLE "grades" RENAME COLUMN "grade_composition_id" TO "assignment_id"`,
    );
    await queryRunner.query(
      `CREATE TABLE "assignments" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" character varying(100) NOT NULL, "max_score" integer NOT NULL, "grade_composition_id" integer NOT NULL, CONSTRAINT "PK_c54ca359535e0012b04dcbd80ee" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "assignments" ADD CONSTRAINT "FK_32de4774662eb231d6b3634828a" FOREIGN KEY ("grade_composition_id") REFERENCES "grade_compositions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "grades" ADD CONSTRAINT "FK_361ad24212a796fb219e19b3f08" FOREIGN KEY ("assignment_id") REFERENCES "assignments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "grades" DROP CONSTRAINT "FK_361ad24212a796fb219e19b3f08"`,
    );
    await queryRunner.query(
      `ALTER TABLE "assignments" DROP CONSTRAINT "FK_32de4774662eb231d6b3634828a"`,
    );
    await queryRunner.query(`DROP TABLE "assignments"`);
    await queryRunner.query(
      `ALTER TABLE "grades" RENAME COLUMN "assignment_id" TO "grade_composition_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "grades" ADD CONSTRAINT "FK_ad57529b4f66366028845513306" FOREIGN KEY ("grade_composition_id") REFERENCES "grade_compositions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
