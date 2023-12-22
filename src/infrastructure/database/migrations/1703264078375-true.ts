import { MigrationInterface, QueryRunner } from 'typeorm';

export class True1703264078375 implements MigrationInterface {
  name = 'True1703264078375';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "teacher_classes" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "class_id" integer NOT NULL, "user_id" integer NOT NULL, CONSTRAINT "PK_2b46dde7177f3bad651c33d6cc5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "teacher_classes" ADD CONSTRAINT "FK_152b6c918284e68c47494812aa2" FOREIGN KEY ("class_id") REFERENCES "classes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "teacher_classes" ADD CONSTRAINT "FK_c8a260d7a315bd75b7d74cd078a" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "teacher_classes" DROP CONSTRAINT "FK_c8a260d7a315bd75b7d74cd078a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "teacher_classes" DROP CONSTRAINT "FK_152b6c918284e68c47494812aa2"`,
    );
    await queryRunner.query(`DROP TABLE "teacher_classes"`);
  }
}
