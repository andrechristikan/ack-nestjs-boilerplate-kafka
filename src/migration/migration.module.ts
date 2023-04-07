import { Module } from '@nestjs/common';
import { CommandModule } from 'nestjs-command';
import { CommonModule } from 'src/common/common.module';
import { KafkaAdminModule } from 'src/kafka/kafka.admin.module';
import { MigrationKafkaTopicsSeed } from 'src/migration/seeds/migration.kafka-topics.seed';
import { MigrationSettingSeed } from 'src/migration/seeds/migration.setting.seed';

@Module({
    imports: [CommonModule, CommandModule, KafkaAdminModule],
    providers: [MigrationKafkaTopicsSeed, MigrationSettingSeed],
    exports: [],
})
export class MigrationModule {}
