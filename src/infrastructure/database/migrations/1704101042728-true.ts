import { MigrationInterface, QueryRunner } from 'typeorm';

export class True1704101042728 implements MigrationInterface {
  name = 'True1704101042728';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "classes" ADD "background_image" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "classes" DROP COLUMN "background_image"`,
    );
  }
}
