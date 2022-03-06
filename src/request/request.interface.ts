export interface IRequestKafkaHeader {
    user?: string;
}

export interface IRequestKafka<T = Record<string, string>> {
    key: string;
    value: T;
    headers?: IRequestKafkaHeader;
}

export interface IKafkaProducerOptions {
    headers?: IRequestKafkaHeader;
}
