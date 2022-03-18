import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Admin, Kafka, KafkaConfig } from 'kafkajs';
import { Logger } from '@nestjs/common/services/logger.service';
import { ConfigService } from '@nestjs/config';
import { ITopicConfig } from '@nestjs/microservices/external/kafka.interface';
import { KAFKA_TOPICS } from 'src/kafka/kafka.constant';

@Injectable()
export class KafkaAdminService implements OnModuleInit, OnModuleDestroy {
    private readonly kafka: Kafka;
    private readonly admin: Admin;
    private readonly topics: string[];
    private readonly brokers: string[];
    private readonly clientId: string;
    private readonly kafkaOptions: KafkaConfig;
    private readonly defaultPartition: number;

    protected logger = new Logger(KafkaAdminService.name);

    constructor(private readonly configService: ConfigService) {
        this.clientId = this.configService.get<string>('kafka.admin.clientId');
        this.brokers = this.configService.get<string[]>('kafka.brokers');

        this.topics = [...new Set(KAFKA_TOPICS)];

        this.kafkaOptions = {
            clientId: this.clientId,
            brokers: this.brokers,
        };

        this.defaultPartition = this.configService.get<number>(
            'kafka.admin.defaultPartition'
        );

        this.logger.log(`Brokers ${this.brokers}`);
        this.kafka = new Kafka(this.kafkaOptions);

        this.admin = this.kafka.admin();
    }

    async onModuleInit(): Promise<void> {
        this.logger.log(`Connecting ${KafkaAdminService.name} Admin`);

        await this.connect();

        this.logger.log(`${KafkaAdminService.name} Admin Connected`);
    }

    async onModuleDestroy(): Promise<void> {
        this.logger.log(`Disconnecting ${KafkaAdminService.name} Admin`);

        await this.disconnect();

        this.logger.log(`${KafkaAdminService.name} Admin Disconnected`);
    }

    private async connect(): Promise<void> {
        await this.admin.connect();
    }

    private async disconnect(): Promise<void> {
        await this.admin.disconnect();
    }

    private async getAllTopic(): Promise<string[]> {
        return this.admin.listTopics();
    }

    private async getAllTopicUnique(): Promise<string[]> {
        return [...new Set(await this.getAllTopic())].filter(
            (val) => val !== '__consumer_offsets'
        );
    }

    async createTopics(): Promise<boolean> {
        this.logger.log(`Topics ${this.topics}`);

        const currentTopic: string[] = await this.getAllTopicUnique();
        const topics: string[] = this.topics;
        const data: ITopicConfig[] = [];

        for (const topic of topics) {
            if (!currentTopic.includes(topic.toLocaleLowerCase())) {
                data.push({
                    topic: topic.toLocaleLowerCase(),
                    numPartitions: this.defaultPartition,
                    replicationFactor: this.brokers.length,
                });
            }
        }

        const replyTopics: string[] = this.topics.map((val) => `${val}.reply`);
        for (const replyTopic of replyTopics) {
            if (!currentTopic.includes(replyTopic.toLocaleLowerCase())) {
                data.push({
                    topic: replyTopic.toLocaleLowerCase(),
                    numPartitions: this.defaultPartition,
                    replicationFactor: this.brokers.length,
                });
            }
        }

        if (data.length > 0) {
            this.admin.createTopics({
                waitForLeaders: true,
                topics: data,
            });
        }

        this.logger.log(`${KafkaAdminService.name} Topic Created`);

        return true;
    }
}
