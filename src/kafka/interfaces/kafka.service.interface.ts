import { KafkaContext } from '@nestjs/microservices';
import {
    IKafkaMessage,
    IKafkaProducerMessageOptions,
    IKafkaProducerSendMessageOptions,
} from 'src/kafka/interfaces/kafka.interface';

export interface IKafkaService {
    produceSend<T, N>(
        topic: string,
        data: T,
        options?: IKafkaProducerSendMessageOptions
    ): Promise<IKafkaMessage<N> | N>;

    produceEmit<T>(
        topic: string,
        data: T,
        options?: IKafkaProducerMessageOptions
    ): void;

    produceSendSequential<T, N>(
        topic: string,
        data: T,
        options?: IKafkaProducerSendMessageOptions
    ): Promise<IKafkaMessage<N> | N>;

    produceEmitSequential<T>(
        topic: string,
        data: T,
        options?: IKafkaProducerMessageOptions
    ): void;

    createId(): string;

    commitOffsets(context: KafkaContext): Promise<void>;
}
