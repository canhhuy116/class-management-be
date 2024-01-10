import { MigrationInterface, QueryRunner } from "typeorm";

export class True1704870402154 implements MigrationInterface {
    name = 'True1704870402154'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "assignments" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" character varying(100) NOT NULL, "max_score" integer NOT NULL, "grade_composition_id" integer NOT NULL, CONSTRAINT "PK_c54ca359535e0012b04dcbd80ee" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "classes" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" character varying(100) NOT NULL, "description" character varying(100), "is_active" boolean NOT NULL DEFAULT true, "owner_id" integer NOT NULL, "background_image" character varying, CONSTRAINT "PK_e207aa15404e9b2ce35910f9f7f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "grade_compositions" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" character varying(100) NOT NULL, "weight" integer NOT NULL, "class_id" integer NOT NULL, "priority" integer NOT NULL, "viewable" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_05282bfa2c7a0e1457f3c63886f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "grades" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "value" integer NOT NULL, "student_id" character varying NOT NULL, "assignment_id" integer NOT NULL, "teacher_id" integer NOT NULL, CONSTRAINT "PK_4740fb6f5df2505a48649f1687b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "grade_review_comments" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "grade_review_id" integer NOT NULL, "user_id" integer NOT NULL, "message" character varying NOT NULL, CONSTRAINT "PK_acf344c5e16923e135ea93fca32" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "grade_reviews" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "assignment_id" integer NOT NULL, "student_id" character varying NOT NULL, "teacher_id" integer NOT NULL, "value" integer NOT NULL, "expected_value" integer NOT NULL, "message" character varying NOT NULL, "is_reviewed" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_2a571004530b224b5556331c127" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "invitations" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "code" character varying(100) NOT NULL, "inviter_id" integer NOT NULL, "invitee_email" character varying(100), "class_id" integer NOT NULL, "role" character varying(100) NOT NULL, CONSTRAINT "PK_5dec98cfdfd562e4ad3648bbb07" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_INVITATION_CODE" ON "invitations" ("code") `);
        await queryRunner.query(`CREATE TABLE "notifications" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "user_id" integer, "title" character varying NOT NULL, "notification_type" character varying NOT NULL, "link" character varying NOT NULL, "resource_id" integer, CONSTRAINT "PK_6a72c3c0f683f6462415e653c3a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "student_classes" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "class_id" integer NOT NULL, "user_id" integer, "student_id" character varying, "full_name" character varying, CONSTRAINT "PK_e6fcc2e4f8f79a5aa16a50c8f46" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "teacher_classes" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "class_id" integer NOT NULL, "user_id" integer NOT NULL, CONSTRAINT "PK_2b46dde7177f3bad651c33d6cc5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" character varying(100) NOT NULL, "email" character varying(100) NOT NULL, "password" character varying(100), "role" character varying(100) NOT NULL DEFAULT 'USER', "phone_number" character varying(20), "address" character varying(100), "google_id" character varying(100), "facebook_id" character varying(100), "is_active" boolean NOT NULL DEFAULT true, "is_confirmed" boolean NOT NULL DEFAULT false, "studentId" character varying(100), "avatar" character varying, CONSTRAINT "UNIQUE_USERS" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_USERS" ON "users" ("name", "email") `);
        await queryRunner.query(`ALTER TABLE "assignments" ADD CONSTRAINT "FK_32de4774662eb231d6b3634828a" FOREIGN KEY ("grade_composition_id") REFERENCES "grade_compositions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "classes" ADD CONSTRAINT "FK_30d3f3dc5dc991aa1cfe00e035d" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "grade_compositions" ADD CONSTRAINT "FK_c218b9e7a6f7ab9af838cbe11b2" FOREIGN KEY ("class_id") REFERENCES "classes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "grades" ADD CONSTRAINT "FK_4e40960913bb4a4c059fa9939d6" FOREIGN KEY ("teacher_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "grades" ADD CONSTRAINT "FK_361ad24212a796fb219e19b3f08" FOREIGN KEY ("assignment_id") REFERENCES "assignments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "grade_review_comments" ADD CONSTRAINT "FK_b3b3fd795cf0c82a69a209c7d37" FOREIGN KEY ("grade_review_id") REFERENCES "grade_reviews"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "grade_review_comments" ADD CONSTRAINT "FK_6b5fa0c3c1e89cb31a91070d5fc" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "grade_reviews" ADD CONSTRAINT "FK_06555111b13d12302970bd64d2b" FOREIGN KEY ("teacher_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "grade_reviews" ADD CONSTRAINT "FK_729a75302f9510734e6f2f31844" FOREIGN KEY ("assignment_id") REFERENCES "assignments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "invitations" ADD CONSTRAINT "FK_9752bd6630e9c8a1e1b046b43e7" FOREIGN KEY ("inviter_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "invitations" ADD CONSTRAINT "FK_3300addc6708d743c3d81cbacde" FOREIGN KEY ("class_id") REFERENCES "classes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "student_classes" ADD CONSTRAINT "FK_250de2754beaff18091a60a6654" FOREIGN KEY ("class_id") REFERENCES "classes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "student_classes" ADD CONSTRAINT "FK_7f56b213f863785bf86e9ee5b28" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "teacher_classes" ADD CONSTRAINT "FK_152b6c918284e68c47494812aa2" FOREIGN KEY ("class_id") REFERENCES "classes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "teacher_classes" ADD CONSTRAINT "FK_c8a260d7a315bd75b7d74cd078a" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "teacher_classes" DROP CONSTRAINT "FK_c8a260d7a315bd75b7d74cd078a"`);
        await queryRunner.query(`ALTER TABLE "teacher_classes" DROP CONSTRAINT "FK_152b6c918284e68c47494812aa2"`);
        await queryRunner.query(`ALTER TABLE "student_classes" DROP CONSTRAINT "FK_7f56b213f863785bf86e9ee5b28"`);
        await queryRunner.query(`ALTER TABLE "student_classes" DROP CONSTRAINT "FK_250de2754beaff18091a60a6654"`);
        await queryRunner.query(`ALTER TABLE "invitations" DROP CONSTRAINT "FK_3300addc6708d743c3d81cbacde"`);
        await queryRunner.query(`ALTER TABLE "invitations" DROP CONSTRAINT "FK_9752bd6630e9c8a1e1b046b43e7"`);
        await queryRunner.query(`ALTER TABLE "grade_reviews" DROP CONSTRAINT "FK_729a75302f9510734e6f2f31844"`);
        await queryRunner.query(`ALTER TABLE "grade_reviews" DROP CONSTRAINT "FK_06555111b13d12302970bd64d2b"`);
        await queryRunner.query(`ALTER TABLE "grade_review_comments" DROP CONSTRAINT "FK_6b5fa0c3c1e89cb31a91070d5fc"`);
        await queryRunner.query(`ALTER TABLE "grade_review_comments" DROP CONSTRAINT "FK_b3b3fd795cf0c82a69a209c7d37"`);
        await queryRunner.query(`ALTER TABLE "grades" DROP CONSTRAINT "FK_361ad24212a796fb219e19b3f08"`);
        await queryRunner.query(`ALTER TABLE "grades" DROP CONSTRAINT "FK_4e40960913bb4a4c059fa9939d6"`);
        await queryRunner.query(`ALTER TABLE "grade_compositions" DROP CONSTRAINT "FK_c218b9e7a6f7ab9af838cbe11b2"`);
        await queryRunner.query(`ALTER TABLE "classes" DROP CONSTRAINT "FK_30d3f3dc5dc991aa1cfe00e035d"`);
        await queryRunner.query(`ALTER TABLE "assignments" DROP CONSTRAINT "FK_32de4774662eb231d6b3634828a"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_USERS"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "teacher_classes"`);
        await queryRunner.query(`DROP TABLE "student_classes"`);
        await queryRunner.query(`DROP TABLE "notifications"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_INVITATION_CODE"`);
        await queryRunner.query(`DROP TABLE "invitations"`);
        await queryRunner.query(`DROP TABLE "grade_reviews"`);
        await queryRunner.query(`DROP TABLE "grade_review_comments"`);
        await queryRunner.query(`DROP TABLE "grades"`);
        await queryRunner.query(`DROP TABLE "grade_compositions"`);
        await queryRunner.query(`DROP TABLE "classes"`);
        await queryRunner.query(`DROP TABLE "assignments"`);
    }

}
