import { MigrationInterface, QueryRunner } from 'typeorm';

export class True1702137342221 implements MigrationInterface {
  name = 'True1702137342221';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "invitations" ADD "role" character varying(100) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "invitations" ALTER COLUMN "invitee_email" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "invitations" ALTER COLUMN "invitee_email" SET NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "invitations" DROP COLUMN "role"`);
  }
}
