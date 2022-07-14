import {
    Inject,
    Injectable,
    Logger,
    OnApplicationBootstrap,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientKafka } from '@nestjs/microservices';
import { firstValueFrom, lastValueFrom, timeout } from 'rxjs';
import { KAFKA_TOPICS } from 'src/kafka/kafka.constant';
import { HelperDateService } from 'src/utils/helper/service/helper.date.service';
import { HelperStringService } from 'src/utils/helper/service/helper.string.service';
import { KAFKA_PRODUCER_SERVICE_NAME } from '../kafka.producer.constant';
import {
    ENUM_KAFKA_PRODUCER_SEND_RESPONSE,
    IKafkaMessage,
    IKafkaProducerMessageOptions,
    IKafkaProducerSendMessageOptions,
} from '../kafka.producer.interface';

@Injectable()
export class KafkaProducerService implements OnApplicationBootstrap {
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
        const topics: string[] = [...new Set(Object.values(KAFKA_TOPICS))];
        topics.forEach((topic) =>
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
            key: await this.createId(),
            value: data,
            headers: options && options.headers ? options.headers : undefined,
        };

        if (
            options &&
            options.response === ENUM_KAFKA_PRODUCER_SEND_RESPONSE.FIRST
        ) {
            const response: IKafkaMessage<N> = await firstValueFrom(
                this.clientKafka
                    .send<any, IKafkaMessage<T>>(topic, message)
                    .pipe(timeout(this.timeout))
            );
            return options && options.raw ? response : response.value;
        }

        const response: IKafkaMessage<N> = await lastValueFrom(
            this.clientKafka
                .send<any, IKafkaMessage<T>>(topic, message)
                .pipe(timeout(this.timeout))
        );
        return options && options.raw ? response : response.value;
    }

    async emit<T>(
        topic: string,
        data: T,
        options?: IKafkaProducerMessageOptions
    ): Promise<void> {
        const message: IKafkaMessage<T> = {
            key: await this.createId(),
            value: data,
            headers: options && options.headers ? options.headers : undefined,
        };

        this.clientKafka
            .emit<any, IKafkaMessage<T>>(topic, message)
            .pipe(timeout(this.timeout));

        return;
    }

    private async createId(): Promise<string> {
        const rand: string = this.helperStringService.random(10);
        const timestamp = `${this.helperDateService.timestamp()}`;
        return `${timestamp}-${rand}`;
    }
}
