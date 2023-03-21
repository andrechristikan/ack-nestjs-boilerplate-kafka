import {
    Inject,
    Injectable,
    Logger,
    OnApplicationBootstrap,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientKafka } from '@nestjs/microservices';
import { firstValueFrom, timeout } from 'rxjs';
import { HelperDateService } from 'src/common/helper/services/helper.date.service';
import { HelperStringService } from 'src/common/helper/services/helper.string.service';
import {
    IKafkaMessage,
    IKafkaProducerMessageOptions,
    IKafkaProducerSendMessageOptions,
} from 'src/kafka/interfaces/kafka.interface';
import { IKafkaProducerService } from 'src/kafka/interfaces/kafka.producer-service.interface';
import { KAFKA_PRODUCER_SERVICE_NAME } from '../constants/kafka.constant';
import { ENUM_KAFKA_TOPICS } from 'src/kafka/constants/kafka.topic.constant';

@Injectable()
export class KafkaProducerService
    implements IKafkaProducerService, OnApplicationBootstrap
{
    private readonly timeout: number;
    protected logger = new Logger(KafkaProducerService.name);

    constructor(
        private readonly helperStringService: HelperStringService,
        @Inject(KAFKA_PRODUCER_SERVICE_NAME)
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

    async send<T, N>(
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

    emit<T>(
        topic: string,
        data: T,
        options?: IKafkaProducerMessageOptions
    ): void {
        const message: IKafkaMessage<T> = {
            key: this.createId(),
            value: data,
            headers: options && options.headers ? options.headers : undefined,
        };

        this.clientKafka
            .emit<any, string>(topic, JSON.stringify(message))
            .pipe(timeout(this.timeout));

        return;
    }

    async sendSequential<T, N>(
        topic: string,
        data: T,
        options?: IKafkaProducerSendMessageOptions
    ): Promise<IKafkaMessage<N> | N> {
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

    emitSequential<T>(
        topic: string,
        data: T,
        options?: IKafkaProducerMessageOptions
    ): void {
        const message: IKafkaMessage<T> = {
            key: `${topic}-sequential-key`,
            value: data,
            headers: options && options.headers ? options.headers : undefined,
        };

        this.clientKafka
            .emit<any, string>(topic, JSON.stringify(message))
            .pipe(timeout(this.timeout));

        return;
    }

    createId(): string {
        const rand: string = this.helperStringService.random(10);
        const timestamp = `${this.helperDateService.timestamp()}`;
        return `${timestamp}-${rand}`;
    }
}
