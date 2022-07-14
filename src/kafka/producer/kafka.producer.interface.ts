export enum ENUM_KAFKA_PRODUCER_SEND_RESPONSE {
    FIRST = 'FIRST',
    LAST = 'LAST',
}
export interface IKafkaMessageHeader {
    user?: string;
}

export interface IKafkaProducerMessageOptions {
    headers?: IKafkaMessageHeader;
}

export interface IKafkaProducerSendMessageOptions
    extends IKafkaProducerMessageOptions {
    raw?: boolean;
    response?: ENUM_KAFKA_PRODUCER_SEND_RESPONSE;
}

export interface IKafkaMessage<T = Record<string, string>> {
    key: string;
    value: T;
    headers?: IKafkaMessageHeader;
}
