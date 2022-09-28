import { Command } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { KafkaAdminService } from 'src/kafka/services/kafka.admin.service';

@Injectable()
export class KafkaTopicsSeed {
    constructor(private readonly kafkaAdminService: KafkaAdminService) {}

    @Command({
        command: 'insert:kafka-topics',
        describe: 'insert kafka topics',
    })
    async insert(): Promise<void> {
        try {
            await this.kafkaAdminService.createTopics();
        } catch (err: any) {
            throw new Error(err.message);
        }

        return;
    }

    @Command({
        command: 'remove:kafka-topics',
        describe: 'remove kafka topics',
    })
    async remove(): Promise<void> {
        try {
            await this.kafkaAdminService.deleteTopics();
        } catch (err: any) {
            throw new Error(err.message);
        }

        return;
    }
}
