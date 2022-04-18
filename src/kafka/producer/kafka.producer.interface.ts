export interface IKafkaProducerHeader {
    user?: string;
}

export interface IKafkaProducerOptions {
    headers?: IKafkaProducerHeader;
}

export interface IKafkaProducerMessage<T = Record<string, string>> {
    key: string;
    value: T;
    headers?: IKafkaProducerHeader;
}
