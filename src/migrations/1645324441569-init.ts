import { MigrationInterface, QueryRunner } from 'typeorm';

export class init1645324441569 implements MigrationInterface {
  name = 'init1645324441569';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`admin_entity\` (\`id\` int NOT NULL AUTO_INCREMENT, \`loginId\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`currentHashedRefreshToken\` varchar(255) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`asset_entity\` (\`filename\` varchar(255) NOT NULL, \`url\` varchar(255) NOT NULL, PRIMARY KEY (\`filename\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`gui_entity\` (\`id\` varchar(255) NOT NULL, \`data\` json NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`video_file_entity\` (\`id\` int NOT NULL AUTO_INCREMENT, \`url\` varchar(255) NOT NULL, \`fileName\` varchar(255) NOT NULL, \`videoId\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`delete_student_request_entity\` (\`id\` int NOT NULL AUTO_INCREMENT, \`status\` int NOT NULL COMMENT '1: 대기중, 2: 거절, 3: 승인' DEFAULT '1', \`studentNumber\` varchar(255) NOT NULL, \`studentId\` int NULL, \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`student_entity\` (\`id\` int NOT NULL AUTO_INCREMENT, \`studentNumber\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`currentHashedRefreshToken\` varchar(255) NULL, \`activatedAt\` datetime NULL COMMENT '활동 시작일', \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`video_progress_entity\` (\`id\` int NOT NULL AUTO_INCREMENT, \`progress\` int NOT NULL, \`studentId\` int NOT NULL, \`videoId\` int NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`video_entity\` (\`id\` int NOT NULL AUTO_INCREMENT, \`video_url\` varchar(255) NOT NULL, \`video_title\` varchar(255) NOT NULL, \`video_createdAt\` datetime NOT NULL, \`video_channelName\` varchar(255) NOT NULL, \`video_lengthInSeconds\` int NOT NULL, \`video_thumbnail\` varchar(255) NOT NULL, \`title\` varchar(255) NOT NULL, \`description\` varchar(255) NULL, \`isPublic\` tinyint NOT NULL, \`sort\` int NOT NULL COMMENT '한 강의 목록 내에서 강의 순서 값 asc' DEFAULT '0', \`tags\` varchar(255) NULL, \`recommendWeeks\` varchar(255) NULL COMMENT '구분자 ,', \`playlistId\` int NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`playlist_entity\` (\`id\` int NOT NULL AUTO_INCREMENT, \`playlistType\` varchar(255) NOT NULL COMMENT '정규 또는 추천' DEFAULT '정규', \`name\` varchar(255) NOT NULL, \`isPublic\` tinyint NOT NULL, \`week\` int NULL, \`description\` text NULL, \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`video_file_entity\` ADD CONSTRAINT \`FK_9bd521a2cfdb9a1472ca27e0c16\` FOREIGN KEY (\`videoId\`) REFERENCES \`video_entity\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`delete_student_request_entity\` ADD CONSTRAINT \`FK_37ae72e916b61d413b60473ee46\` FOREIGN KEY (\`studentId\`) REFERENCES \`student_entity\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`video_progress_entity\` ADD CONSTRAINT \`FK_1b6f235a7d1725ea5f506ea953d\` FOREIGN KEY (\`studentId\`) REFERENCES \`student_entity\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`video_progress_entity\` ADD CONSTRAINT \`FK_b16b219890de58f361bb7fb2c57\` FOREIGN KEY (\`videoId\`) REFERENCES \`video_entity\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`video_entity\` ADD CONSTRAINT \`FK_cf60f725e0142ce0adf9c0dcfef\` FOREIGN KEY (\`playlistId\`) REFERENCES \`playlist_entity\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`video_entity\` DROP FOREIGN KEY \`FK_cf60f725e0142ce0adf9c0dcfef\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`video_progress_entity\` DROP FOREIGN KEY \`FK_b16b219890de58f361bb7fb2c57\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`video_progress_entity\` DROP FOREIGN KEY \`FK_1b6f235a7d1725ea5f506ea953d\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`delete_student_request_entity\` DROP FOREIGN KEY \`FK_37ae72e916b61d413b60473ee46\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`video_file_entity\` DROP FOREIGN KEY \`FK_9bd521a2cfdb9a1472ca27e0c16\``,
    );
    await queryRunner.query(`DROP TABLE \`playlist_entity\``);
    await queryRunner.query(`DROP TABLE \`video_entity\``);
    await queryRunner.query(`DROP TABLE \`video_progress_entity\``);
    await queryRunner.query(`DROP TABLE \`student_entity\``);
    await queryRunner.query(`DROP TABLE \`delete_student_request_entity\``);
    await queryRunner.query(`DROP TABLE \`video_file_entity\``);
    await queryRunner.query(`DROP TABLE \`gui_entity\``);
    await queryRunner.query(`DROP TABLE \`asset_entity\``);
    await queryRunner.query(`DROP TABLE \`admin_entity\``);
  }
}
