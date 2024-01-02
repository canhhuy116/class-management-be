import { MigrationInterface, QueryRunner } from 'typeorm';

export class True1704215601457 implements MigrationInterface {
  name = 'True1704215601457';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "grades" DROP CONSTRAINT "FK_9acca493883cee3b9e8f9e01cd1"`,
    );
    await queryRunner.query(`ALTER TABLE "grades" DROP COLUMN "student_id"`);
    await queryRunner.query(
      `ALTER TABLE "grades" ADD "student_id" character varying NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "grades" DROP COLUMN "student_id"`);
    await queryRunner.query(
      `ALTER TABLE "grades" ADD "student_id" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "grades" ADD CONSTRAINT "FK_9acca493883cee3b9e8f9e01cd1" FOREIGN KEY ("student_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
