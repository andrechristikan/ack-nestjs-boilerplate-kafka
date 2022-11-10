import { Module } from '@nestjs/common';
import { CommandModule } from 'nestjs-command';
import { ApiKeyModule } from 'src/common/api-key/api-key.module';
import { CommonModule } from 'src/common/common.module';
import { KafkaAdminModule } from 'src/kafka/kafka.module';
import { KafkaTopicsSeed } from 'src/migration/seeds/kafka-topics.seed';

@Module({
    imports: [CommonModule, CommandModule, ApiKeyModule, KafkaAdminModule],
    providers: [KafkaTopicsSeed],
    exports: [],
})
export class MigrationModule {}
