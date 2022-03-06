import {
    Inject,
    Injectable,
    Logger,
    OnApplicationBootstrap,
    OnModuleDestroy,
    Optional,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { firstValueFrom, lastValueFrom, timeout } from 'rxjs';
import { Helper } from 'src/helper/helper.decorator';
import { HelperService } from 'src/helper/helper.service';
import {
    IKafkaProducerOptions,
    IRequestKafka,
} from 'src/request/request.interface';
import { IResponseKafka } from 'src/response/response.interface';
import { KAFKA_TOPICS } from '../kafka.constant';
import { KAFKA_PRODUCER_SERVICE_NAME } from './kafka.producer.constant';

@Injectable()
export class KafkaProducerService
    implements OnApplicationBootstrap, OnModuleDestroy
{
    protected logger = new Logger(KafkaProducerService.name);

    constructor(
        @Helper() private readonly helperService: HelperService,
        @Optional()
        @Inject(KAFKA_PRODUCER_SERVICE_NAME)
        private readonly kafka: ClientKafka
    ) {}

    async onApplicationBootstrap(): Promise<void> {
        const topics: string[] = [...new Set(KAFKA_TOPICS)];
        for (const topic of topics) {
            this.kafka.subscribeToResponseOf(topic);
        }

        await this.kafka.connect();

        this.logger.log('Kafka Client Connected');
    }

    async onModuleDestroy(): Promise<void> {
        await this.kafka.close();
    }

    async send<T>(
        topic: string,
        data: T,
        options?: IKafkaProducerOptions
    ): Promise<IResponseKafka> {
        const request: IRequestKafka<T> = {
            key: await this.createId(),
            value: data,
            headers: options && options.headers ? options.headers : undefined,
        };

        const firstValue = await firstValueFrom(
            this.kafka
                .send<any, IRequestKafka<T>>(topic, request)
                .pipe(timeout(5000))
        );
        const lastValue = await lastValueFrom(
            this.kafka
                .send<any, IRequestKafka<T>>(topic, request)
                .pipe(timeout(5000))
        );

        return {
            firstValue,
            lastValue,
        };
    }

    private async createId(): Promise<string> {
        const rand: string = await this.helperService.stringRandom(10);
        const timestamp = `${new Date().valueOf()}`;
        return `${timestamp}-${rand}`;
    }
}
