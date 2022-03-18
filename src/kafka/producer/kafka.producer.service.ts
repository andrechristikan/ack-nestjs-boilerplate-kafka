import {
    Inject,
    Injectable,
    Logger,
    OnApplicationBootstrap,
    OnModuleDestroy,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientKafka } from '@nestjs/microservices';
import { lastValueFrom, timeout } from 'rxjs';
import { Helper } from 'src/helper/helper.decorator';
import { HelperService } from 'src/helper/helper.service';
import { IRequestKafka } from 'src/request/request.interface';
import { IResponseKafka } from 'src/response/response.interface';
import { KAFKA_TOPICS } from '../kafka.constant';
import { KAFKA_PRODUCER_SERVICE_NAME } from './kafka.producer.constant';
import { IKafkaProducerOptions } from './kafka.producer.interface';

@Injectable()
export class KafkaProducerService
    implements OnApplicationBootstrap, OnModuleDestroy
{
    protected logger = new Logger(KafkaProducerService.name);
    private readonly producerSend: Record<string, any>;

    constructor(
        @Helper() private readonly helperService: HelperService,
        @Inject(KAFKA_PRODUCER_SERVICE_NAME)
        private readonly clientKafka: ClientKafka,
        private readonly configService: ConfigService
    ) {
        this.producerSend =
            this.configService.get<Record<string, any>>('kafka.producerSend');
    }

    async onApplicationBootstrap(): Promise<void> {
        const topics: string[] = [...new Set(KAFKA_TOPICS)];
        for (const topic of topics) {
            this.clientKafka.subscribeToResponseOf(topic.toLowerCase());
        }

        await this.clientKafka.connect();

        this.logger.log('Kafka Client Connected');
    }

    async onModuleDestroy(): Promise<void> {
        await this.clientKafka.close();
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

        return lastValueFrom(
            this.clientKafka
                .send<any, IRequestKafka<T>>(topic, request)
                .pipe(timeout(this.producerSend.timeout))
        );
    }

    private async createId(): Promise<string> {
        const rand: string = await this.helperService.stringRandom(10);
        const timestamp = `${new Date().valueOf()}`;
        return `${timestamp}-${rand}`;
    }
}
