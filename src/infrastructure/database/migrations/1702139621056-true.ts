import { MigrationInterface, QueryRunner } from 'typeorm';

export class True1702139621056 implements MigrationInterface {
  name = 'True1702139621056';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "classes" ADD "owner_id" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "classes" ADD CONSTRAINT "FK_30d3f3dc5dc991aa1cfe00e035d" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "classes" DROP CONSTRAINT "FK_30d3f3dc5dc991aa1cfe00e035d"`,
    );
    await queryRunner.query(`ALTER TABLE "classes" DROP COLUMN "owner_id"`);
  }
}
