import { MigrationInterface, QueryRunner } from "typeorm";

export class True1704816732743 implements MigrationInterface {
    name = 'True1704816732743'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "grade_review_comments" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "grade_review_id" integer NOT NULL, "user_id" integer NOT NULL, "message" character varying NOT NULL, CONSTRAINT "PK_acf344c5e16923e135ea93fca32" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "grade_reviews" DROP COLUMN "comment_approve"`);
        await queryRunner.query(`ALTER TABLE "grade_reviews" DROP COLUMN "comment_reject"`);
        await queryRunner.query(`ALTER TABLE "grade_review_comments" ADD CONSTRAINT "FK_b3b3fd795cf0c82a69a209c7d37" FOREIGN KEY ("grade_review_id") REFERENCES "grade_reviews"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "grade_review_comments" ADD CONSTRAINT "FK_6b5fa0c3c1e89cb31a91070d5fc" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "grade_review_comments" DROP CONSTRAINT "FK_6b5fa0c3c1e89cb31a91070d5fc"`);
        await queryRunner.query(`ALTER TABLE "grade_review_comments" DROP CONSTRAINT "FK_b3b3fd795cf0c82a69a209c7d37"`);
        await queryRunner.query(`ALTER TABLE "grade_reviews" ADD "comment_reject" character varying`);
        await queryRunner.query(`ALTER TABLE "grade_reviews" ADD "comment_approve" character varying`);
        await queryRunner.query(`DROP TABLE "grade_review_comments"`);
    }

}
