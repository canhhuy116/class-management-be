import { MigrationInterface, QueryRunner } from "typeorm";

export class True1702135527336 implements MigrationInterface {
    name = 'True1702135527336'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "classes" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" character varying(100) NOT NULL, "description" character varying(100), CONSTRAINT "PK_e207aa15404e9b2ce35910f9f7f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "invitations" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "code" character varying(100) NOT NULL, "inviter_id" integer NOT NULL, "invitee_email" character varying(100) NOT NULL, "class_id" integer NOT NULL, CONSTRAINT "PK_5dec98cfdfd562e4ad3648bbb07" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "classes_teachers_users" ("classesId" integer NOT NULL, "usersId" integer NOT NULL, CONSTRAINT "PK_758d6c016518eccc416de8f58a7" PRIMARY KEY ("classesId", "usersId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_ceff5262f33630ed4a4cf0fd12" ON "classes_teachers_users" ("classesId") `);
        await queryRunner.query(`CREATE INDEX "IDX_274a3c3c4e27bbd54ea216036a" ON "classes_teachers_users" ("usersId") `);
        await queryRunner.query(`CREATE TABLE "classes_students_users" ("classesId" integer NOT NULL, "usersId" integer NOT NULL, CONSTRAINT "PK_2328363a1ac9e3637b916db553b" PRIMARY KEY ("classesId", "usersId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_15e5f3b5fb64447e20931cbf43" ON "classes_students_users" ("classesId") `);
        await queryRunner.query(`CREATE INDEX "IDX_06f264cd952994f4bb543d58e0" ON "classes_students_users" ("usersId") `);
        await queryRunner.query(`ALTER TABLE "invitations" ADD CONSTRAINT "FK_9752bd6630e9c8a1e1b046b43e7" FOREIGN KEY ("inviter_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "invitations" ADD CONSTRAINT "FK_3300addc6708d743c3d81cbacde" FOREIGN KEY ("class_id") REFERENCES "classes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "classes_teachers_users" ADD CONSTRAINT "FK_ceff5262f33630ed4a4cf0fd123" FOREIGN KEY ("classesId") REFERENCES "classes"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "classes_teachers_users" ADD CONSTRAINT "FK_274a3c3c4e27bbd54ea216036a3" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "classes_students_users" ADD CONSTRAINT "FK_15e5f3b5fb64447e20931cbf430" FOREIGN KEY ("classesId") REFERENCES "classes"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "classes_students_users" ADD CONSTRAINT "FK_06f264cd952994f4bb543d58e0c" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "classes_students_users" DROP CONSTRAINT "FK_06f264cd952994f4bb543d58e0c"`);
        await queryRunner.query(`ALTER TABLE "classes_students_users" DROP CONSTRAINT "FK_15e5f3b5fb64447e20931cbf430"`);
        await queryRunner.query(`ALTER TABLE "classes_teachers_users" DROP CONSTRAINT "FK_274a3c3c4e27bbd54ea216036a3"`);
        await queryRunner.query(`ALTER TABLE "classes_teachers_users" DROP CONSTRAINT "FK_ceff5262f33630ed4a4cf0fd123"`);
        await queryRunner.query(`ALTER TABLE "invitations" DROP CONSTRAINT "FK_3300addc6708d743c3d81cbacde"`);
        await queryRunner.query(`ALTER TABLE "invitations" DROP CONSTRAINT "FK_9752bd6630e9c8a1e1b046b43e7"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_06f264cd952994f4bb543d58e0"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_15e5f3b5fb64447e20931cbf43"`);
        await queryRunner.query(`DROP TABLE "classes_students_users"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_274a3c3c4e27bbd54ea216036a"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ceff5262f33630ed4a4cf0fd12"`);
        await queryRunner.query(`DROP TABLE "classes_teachers_users"`);
        await queryRunner.query(`DROP TABLE "invitations"`);
        await queryRunner.query(`DROP TABLE "classes"`);
    }

}
