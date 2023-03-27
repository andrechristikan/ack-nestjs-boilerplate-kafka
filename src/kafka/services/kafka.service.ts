import {
    Inject,
    Injectable,
    Logger,
    OnApplicationBootstrap,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientKafka, KafkaContext } from '@nestjs/microservices';
import { Observable, firstValueFrom, timeout } from 'rxjs';
import { HelperDateService } from 'src/common/helper/services/helper.date.service';
import { HelperStringService } from 'src/common/helper/services/helper.string.service';
import {
    IKafkaMessage,
    IKafkaProducerMessageOptions,
    IKafkaProducerSendMessageOptions,
} from 'src/kafka/interfaces/kafka.interface';
import { IKafkaService } from 'src/kafka/interfaces/kafka.service.interface';
import { ENUM_KAFKA_TOPICS } from 'src/kafka/constants/kafka.topic.constant';
import { KAFKA_SERVICE_NAME } from 'src/kafka/constants/kafka.constant';

// note:
// if we want create sequential execution
// key must same, maxInFlightRequests set to 1
// and topic mush created with 1 partition and 1 replication

@Injectable()
export class KafkaService implements IKafkaService, OnApplicationBootstrap {
    private readonly timeout: number;
    protected logger = new Logger(KafkaService.name);

    constructor(
        private readonly helperStringService: HelperStringService,
        @Inject(KAFKA_SERVICE_NAME)
        private readonly clientKafka: ClientKafka,
        private readonly configService: ConfigService,
        private readonly helperDateService: HelperDateService
    ) {
        this.timeout = this.configService.get<number>(
            'kafka.producerSend.timeout'
        );
    }

    async onApplicationBootstrap(): Promise<void> {
        Object.values(ENUM_KAFKA_TOPICS).forEach((topic) =>
            this.clientKafka.subscribeToResponseOf(topic)
        );

        await this.clientKafka.connect();

        this.logger.log('Kafka Client Connected');
    }

    async produceSend<T, N>(
        topic: string,
        data: T,
        options?: IKafkaProducerSendMessageOptions
    ): Promise<IKafkaMessage<N> | N> {
        const message: IKafkaMessage<T> = {
            key: this.createId(),
            value: data,
            headers: options && options.headers ? options.headers : undefined,
        };

        const send = await firstValueFrom(
            this.clientKafka
                .send<any, string>(topic, JSON.stringify(message))
                .pipe(timeout(this.timeout))
        );

        if (send.error) {
            throw send.error;
        }

        return options && options.raw ? send : send.value;
    }

    produceEmit<T, N>(
        topic: string,
        data: T,
        options?: IKafkaProducerMessageOptions
    ): Observable<N> {
        const message: IKafkaMessage<T> = {
            key: this.createId(),
            value: data,
            headers: options && options.headers ? options.headers : undefined,
        };

        return this.clientKafka
            .emit<any, string>(topic, JSON.stringify(message))
            .pipe(timeout(this.timeout));
    }

    async produceSendSequential<T, N = any>(
        topic: string,
        data: T,
        options?: IKafkaProducerSendMessageOptions
    ): Promise<N> {
        const message: IKafkaMessage<T> = {
            key: `${topic}-sequential-key`,
            value: data,
            headers: options && options.headers ? options.headers : undefined,
        };

        const send = await firstValueFrom(
            this.clientKafka
                .send<any, string>(topic, JSON.stringify(message))
                .pipe(timeout(this.timeout))
        );

        if (send.error) {
            throw send.error;
        }

        return options && options.raw ? send : send.value;
    }

    produceEmitSequential<T, N = any>(
        topic: string,
        data: T,
        options?: IKafkaProducerMessageOptions
    ): Observable<N> {
        const message: IKafkaMessage<T> = {
            key: `${topic}-sequential-key`,
            value: data,
            headers: options && options.headers ? options.headers : undefined,
        };

        return this.clientKafka
            .emit<any, string>(topic, JSON.stringify(message))
            .pipe(timeout(this.timeout));
    }

    createId(): string {
        const rand: string = this.helperStringService.random(10);
        const timestamp = `${this.helperDateService.timestamp()}`;
        return `${timestamp}-${rand}`;
    }

    async commitOffsets(context: KafkaContext): Promise<void> {
        const originalMessage = context.getMessage();
        const kafkaTopic = context.getTopic();
        const kafkaPartition = context.getPartition();
        const { offset } = originalMessage;

        return this.clientKafka.commitOffsets([
            { topic: kafkaTopic, partition: kafkaPartition, offset },
        ]);
    }
}
