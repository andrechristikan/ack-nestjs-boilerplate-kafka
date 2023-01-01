import { Module } from '@nestjs/common';
import { CommandModule } from 'nestjs-command';
import { ApiKeyModule } from 'src/common/api-key/api-key.module';
import { CommonModule } from 'src/common/common.module';
import { KafkaAdminModule } from 'src/kafka/kafka.module';
import { MigrationApiKeySeed } from 'src/migration/seeds/migration.api-key.seed';
import { MigrationKafkaTopicsSeed } from 'src/migration/seeds/migration.kafka-topics.seed';
import { MigrationSettingSeed } from 'src/migration/seeds/migration.setting.seed';

@Module({
    imports: [CommonModule, CommandModule, ApiKeyModule, KafkaAdminModule],
    providers: [
        MigrationKafkaTopicsSeed,
        MigrationApiKeySeed,
        MigrationSettingSeed,
    ],
    exports: [],
})
export class MigrationModule {}
