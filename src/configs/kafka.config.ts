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
            sessionTimeout: ms('60s'), // 6000 .. 300000
            rebalanceTimeout: ms('90s'), // 300000
            heartbeatInterval: ms('3s'), // 3000

            maxBytesPerPartition: bytes('1mb'), // 1mb
            maxBytes: bytes('10mb'), // 5mb
            maxWaitTimeInMs: ms('5s'), // 5s

            maxInFlightRequests: null, // set this to make customer guaranteed sequential

            retry: {
                maxRetryTime: ms('60s'), // 30s
                initialRetryTime: ms('0.3s'), // 3s
                retries: 5,
            },
        },
        consumerSubscribe: {
            fromBeginning: false,
        },

        // producer
        producer: {
            createPartitioner: Partitioners.LegacyPartitioner,
            transactionTimeout: ms('100s'), // 30000 .. 60000

            retry: {
                maxRetryTime: ms('60s'), // 30s
                initialRetryTime: ms('0.3s'), // 3s
                retries: 5,
            },
        },
        producerSend: {
            timeout: ms('30s'), // 30s
        },

        // topic creation
        allowAutoTopicCreation: false,

        // admin
        admin: {
            clientId: process.env.KAFKA_ADMIN_CLIENT_ID || 'KAFKA_ADMIN_ACK',
            defaultPartition: 3,
        },
    })
);
