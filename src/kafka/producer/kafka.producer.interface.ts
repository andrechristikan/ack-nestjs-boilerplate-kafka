export interface IKafkaMessageHeader {
    user?: string;
}

export interface IKafkaProducerMessageOptions {
    headers?: IKafkaMessageHeader;
}

export interface IKafkaProducerSendMessageOptions
    extends IKafkaProducerMessageOptions {
    raw?: boolean;
}

export interface IKafkaMessage<T = Record<string, string>> {
    key: string;
    value: T;
    headers?: IKafkaMessageHeader;
}
