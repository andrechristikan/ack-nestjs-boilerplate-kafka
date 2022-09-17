import {
    IKafkaMessage,
    IKafkaProducerMessageOptions,
    IKafkaProducerSendMessageOptions,
} from 'src/kafka/interfaces/kafka.interface';

export interface IKafkaProducerService {
    send<T, N>(
        topic: string,
        data: T,
        options?: IKafkaProducerSendMessageOptions
    ): Promise<IKafkaMessage<N> | N>;

    emit<T>(
        topic: string,
        data: T,
        options?: IKafkaProducerMessageOptions
    ): void;

    createId(): string;
}
