import { registerAs } from '@nestjs/config';

export default registerAs(
    'kafka',
    (): Record<string, any> => ({
        clientId: process.env.KAFKA_CLIENT_ID || 'KAFKA_ACK',
        brokers: process.env.KAFKA_BROKERS
            ? process.env.KAFKA_BROKERS.split(',')
            : ['localhost:9092'],

        // consumer
        consumer: {
            group: process.env.KAFKA_CONSUMER_GROUP || 'nestjs.ack',
            sessionTimeout: 30 * 1000, // 30s
            rebalanceTimeout: 60 * 1000, //60s
            heartbeatInterval: 5 * 1000, // 5s

            maxBytesPerPartition: 1 * 11048576, // 1mb
            maxBytes: 5 * 11048576, // 5mb
            maxWaitTimeInMs: 5 * 1000, // 5s

            allowAutoTopicCreation: false,
            retry: {
                maxRetryTime: 30 * 1000, // 30s
                initialRetryTime: 1 * 1000, // 1s
                retries: 8,
            },
        },
        consumerSubscribe: {
            fromBeginning: true,
        },

        // producer
        producer: {
            transactionTimeout: 60 * 1000, //60s
            allowAutoTopicCreation: false,
            retry: {
                maxRetryTime: 30 * 1000, // 30s
                initialRetryTime: 1 * 1000, // 1s
                retries: 8,
            },
        },
        producerSend: {
            timeout: 10 * 1000, // 10s
        },

        // admin
        admin: {
            clientId: process.env.KAFKA_ADMIN_CLIENT_ID || 'KAFKA_ADMIN_ACK',
            defaultPartition: 3,
        },
    })
);
