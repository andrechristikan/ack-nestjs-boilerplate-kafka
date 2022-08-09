export enum ENUM_KAFKA_TOPICS {
    ACK_SUCCESS = 'nestjs.ack.success',
    ACK_ERROR = 'nestjs.ack.error',
}

export enum ENUM_KAFKA_REQUEST_METHOD {
    RPC = 'RPC',
}

export const KAFKA_TOPICS: string[] = [
    ...new Set(Object.values(ENUM_KAFKA_TOPICS)),
];

export const KAFKA_TOPICS_REPLY: string[] = [
    ...new Set(Object.values(ENUM_KAFKA_TOPICS).map((val) => `${val}.reply`)),
];
