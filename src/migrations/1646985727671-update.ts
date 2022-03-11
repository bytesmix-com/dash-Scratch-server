import {MigrationInterface, QueryRunner} from "typeorm";

export class update1646985727671 implements MigrationInterface {
    name = 'update1646985727671'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`video_entity\` ADD \`shareScratchInRegularPlaylist\` tinyint NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE \`playlist_entity\` ADD \`shareScratchWithRegularPlaylistId\` int NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`playlist_entity\` DROP COLUMN \`shareScratchWithRegularPlaylistId\``);
        await queryRunner.query(`ALTER TABLE \`video_entity\` DROP COLUMN \`shareScratchInRegularPlaylist\``);
    }

}
