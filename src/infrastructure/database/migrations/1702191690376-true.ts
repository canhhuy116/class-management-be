import { MigrationInterface, QueryRunner } from 'typeorm';

export class True1702191690376 implements MigrationInterface {
  name = 'True1702191690376';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_INVITATION_CODE" ON "invitations" ("code") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."IDX_INVITATION_CODE"`);
  }
}
