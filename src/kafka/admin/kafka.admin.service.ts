import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Admin, Kafka, KafkaConfig } from 'kafkajs';
import { Logger } from '@nestjs/common/services/logger.service';
import { ConfigService } from '@nestjs/config';
import { ITopicConfig } from '@nestjs/microservices/external/kafka.interface';
import {
    KAFKA_TOPICS_CONSUMER,
    KAFKA_TOPICS_SUBSCRIBE,
} from 'src/kafka/kafka.constant';

@Injectable()
export class KafkaAdminService implements OnModuleInit, OnModuleDestroy {
    private readonly kafka: Kafka;
    private readonly admin: Admin;
    private readonly topics: string[];
    private readonly brokers: string[];
    private readonly name: string;
    private readonly clientId: string;
    private readonly kafkaOptions: KafkaConfig;
    private readonly defaultPartition: number;
    private readonly producerMessageResponseSubscription: boolean;

    protected logger = new Logger(KafkaAdminService.name);

    constructor(private readonly configService: ConfigService) {
        this.brokers = this.configService.get<string[]>('kafka.brokers');
        this.topics = [
            ...new Set([...KAFKA_TOPICS_SUBSCRIBE, ...KAFKA_TOPICS_CONSUMER]),
        ].sort();
        this.clientId = this.configService.get<string>('kafka.admin.clientId');
        this.kafkaOptions = {
            clientId: this.clientId,
            brokers: this.brokers,
        };
        this.name = KafkaAdminService.name;
        this.defaultPartition = this.configService.get<number>(
            'kafka.admin.defaultPartition'
        );
        this.producerMessageResponseSubscription =
            this.configService.get<boolean>(
                'kafka.producerMessageResponseSubscription'
            );

        this.logger.log(`Starting ${this.name} ...`);
        this.logger.log(`Brokers ${this.brokers}`);

        this.kafka = new Kafka(this.kafkaOptions);

        this.logger.log(`Connecting ${this.name} Admin ...`);
        this.admin = this.kafka.admin();
    }

    async onModuleInit(): Promise<void> {
        await this.connect();

        this.logger.log(`${this.name} Admin Connected`);
    }

    async onModuleDestroy(): Promise<void> {
        await this.disconnect();
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
        return [...new Set(await this.getAllTopic())]
            .sort()
            .filter((val) => val !== '__consumer_offsets');
    }

    async createTopics(): Promise<boolean> {
        this.logger.log(`Topics ${this.topics}`);

        const currentTopic: string[] = await this.getAllTopicUnique();
        const topics: string[] = this.topics;
        const data: ITopicConfig[] = [];

        for (const topic of topics) {
            if (!currentTopic.includes(topic)) {
                data.push({
                    topic,
                    numPartitions: this.defaultPartition,
                    replicationFactor: this.brokers.length,
                });
            }
        }

        if (this.producerMessageResponseSubscription) {
            const replyTopics: string[] = this.topics.map(
                (val) => `${val}.reply`
            );
            for (const replyTopic of replyTopics) {
                if (!currentTopic.includes(replyTopic)) {
                    data.push({
                        topic: replyTopic,
                        numPartitions: this.defaultPartition,
                        replicationFactor: this.brokers.length,
                    });
                }
            }
        }

        if (data.length > 0) {
            this.admin.createTopics({
                waitForLeaders: true,
                topics: data,
            });
        }

        this.logger.log(`${this.name} Topic Created`);

        return true;
    }
}
