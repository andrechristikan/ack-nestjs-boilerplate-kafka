import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestApplication } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConsumerConfig, ConsumerSubscribeTopics } from 'kafkajs';
import { KAFKA_TOPICS } from 'src/kafka/constants/kafka.constant';

export default async function (app: NestApplication) {
    const configService = app.get(ConfigService);
    const logger = new Logger();

    const enable: boolean = configService.get<boolean>('kafka.enable');
    const brokers: string[] = configService.get<string[]>('kafka.brokers');
    const clientId: string = configService.get<string>('kafka.clientId');
    const consumerGroup: string = configService.get<string>(
        'kafka.consumer.groupId'
    );

    const consumer: ConsumerConfig =
        configService.get<ConsumerConfig>('kafka.consumer');
    const subscribe: ConsumerSubscribeTopics = {
        topics: KAFKA_TOPICS,
        ...configService.get<ConsumerSubscribeTopics>(
            'kafka.consumerSubscribe'
        ),
    };

    if (enable) {
        app.connectMicroservice<MicroserviceOptions>({
            transport: Transport.KAFKA,
            options: {
                client: {
                    clientId,
                    brokers,
                },
                subscribe,
                consumer,
            },
        });

        await app.startAllMicroservices();

        logger.log(
            `Kafka server ${clientId} connected on brokers ${brokers.join(
                ', '
            )}`,
            'NestApplication'
        );
        logger.log(`Kafka consume group ${consumerGroup}`, 'NestApplication');

        logger.log(
            `==========================================================`
        );
    }
}
