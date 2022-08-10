import { ENUM_KAFKA_TOPICS } from './kafka.topic.constant';

export const KAFKA_PRODUCER_SERVICE_NAME = 'KAFKA_PRODUCER_SERVICE';

export const KAFKA_TOPICS: string[] = [
    ...new Set(Object.values(ENUM_KAFKA_TOPICS)),
];

export const KAFKA_TOPICS_REPLY: string[] = [
    ...new Set(Object.values(ENUM_KAFKA_TOPICS).map((val) => `${val}.reply`)),
];
