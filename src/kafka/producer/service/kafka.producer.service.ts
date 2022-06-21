import {
    Inject,
    Injectable,
    Logger,
    OnApplicationBootstrap,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientKafka } from '@nestjs/microservices';
import { lastValueFrom, Observable, timeout } from 'rxjs';
import { KAFKA_TOPICS } from 'src/kafka/kafka.constant';
import { IResponseKafka } from 'src/kafka/utils/request/kafka.request.interface';
import { HelperDateService } from 'src/utils/helper/service/helper.date.service';
import { HelperStringService } from 'src/utils/helper/service/helper.string.service';
import { KAFKA_PRODUCER_SERVICE_NAME } from '../kafka.producer.constant';
import {
    IKafkaMessage,
    IKafkaProducerMessageOptions,
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
            this.clientKafka.subscribeToResponseOf(topic.toLowerCase())
        );

        await this.clientKafka.connect();

        this.logger.log('Kafka Client Connected');
    }

    async send<T>(
        topic: string,
        data: T,
        options?: IKafkaProducerMessageOptions
    ): Promise<Observable<IResponseKafka>> {
        const message: IKafkaMessage<T> = {
            key: await this.createId(),
            value: data,
            headers: options && options.headers ? options.headers : undefined,
        };

        return lastValueFrom(
            this.clientKafka
                .send<any, IKafkaMessage<T>>(topic, message)
                .pipe(timeout(this.timeout))
        );
    }

    async emit<T>(
        topic: string,
        data: T,
        options?: IKafkaProducerMessageOptions
    ): Promise<Observable<void>> {
        const message: IKafkaMessage<T> = {
            key: await this.createId(),
            value: data,
            headers: options && options.headers ? options.headers : undefined,
        };

        await lastValueFrom(
            this.clientKafka
                .emit<any, IKafkaMessage<T>>(topic, message)
                .pipe(timeout(this.timeout))
        );

        return;
    }

    private async createId(): Promise<string> {
        const rand: string = this.helperStringService.random(10);
        const timestamp = `${this.helperDateService.timestamp()}`;
        return `${timestamp}-${rand}`;
    }
}
