import { MigrationInterface, QueryRunner } from 'typeorm';

export class True1703262944285 implements MigrationInterface {
  name = 'True1703262944285';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "student_classes" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "class_id" integer NOT NULL, "user_id" integer NOT NULL, "student_id" character varying NOT NULL, CONSTRAINT "PK_e6fcc2e4f8f79a5aa16a50c8f46" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "student_id"`);
    await queryRunner.query(
      `ALTER TABLE "student_classes" ADD CONSTRAINT "FK_250de2754beaff18091a60a6654" FOREIGN KEY ("class_id") REFERENCES "classes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
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
      `ALTER TABLE "student_classes" DROP CONSTRAINT "FK_250de2754beaff18091a60a6654"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "student_id" character varying(100)`,
    );
    await queryRunner.query(`DROP TABLE "student_classes"`);
  }
}
