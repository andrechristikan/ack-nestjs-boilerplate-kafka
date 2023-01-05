import { registerAs } from '@nestjs/config';
import ms from 'ms';
import bytes from 'bytes';
import { Partitioners } from 'kafkajs';

export default registerAs(
    'kafka',
    (): Record<string, any> => ({
        clientId: process.env.KAFKA_CLIENT_ID || 'KAFKA_ACK',
        brokers: process.env.KAFKA_BROKERS
            ? process.env.KAFKA_BROKERS.split(',')
            : ['localhost:9092'],

        // consumer
        consumerEnable: process.env.KAFKA_CONSUMER_ENABLE === 'true',
        consumer: {
            groupId: process.env.KAFKA_CONSUMER_GROUP || 'nestjs.ack',
            sessionTimeout: ms('30s'), // 30s
            rebalanceTimeout: ms('60s'), //60s
            heartbeatInterval: ms('5s'), // 5s

            maxBytesPerPartition: bytes('1mb'), // 1mb
            maxBytes: bytes('5mb'), // 5mb
            maxWaitTimeInMs: ms('5s'), // 5s

            allowAutoTopicCreation: false,
            retry: {
                maxRetryTime: ms('30s'), // 30s
                initialRetryTime: ms('3s'), // 3s
                retries: 8,
            },
        },
        consumerSubscribe: {
            fromBeginning: true,
        },

        // producer
        producerEnable: process.env.KAFKA_PRODUCER_ENABLE === 'true',
        producer: {
            createPartitioner: Partitioners.DefaultPartitioner,
            transactionTimeout: ms('60s'), //60s
            allowAutoTopicCreation: false,
            retry: {
                maxRetryTime: ms('30s'), // 30s
                initialRetryTime: ms('3s'), // 3s
                retries: 8,
            },
        },
        producerSend: {
            timeout: ms('30s'), // 30s
        },

        // admin
        admin: {
            clientId: process.env.KAFKA_ADMIN_CLIENT_ID || 'KAFKA_ADMIN_ACK',
            defaultPartition: 3,
        },
    })
);
