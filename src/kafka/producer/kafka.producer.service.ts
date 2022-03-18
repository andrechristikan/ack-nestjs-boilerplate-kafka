import {
    Inject,
    Injectable,
    Logger,
    OnApplicationBootstrap,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientKafka } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { Helper } from 'src/helper/helper.decorator';
import { HelperService } from 'src/helper/helper.service';
import { IRequestKafka } from 'src/request/request.interface';
import { IResponseKafka } from 'src/response/response.interface';
import { KAFKA_TOPICS } from '../kafka.constant';
import { KAFKA_PRODUCER_SERVICE_NAME } from './kafka.producer.constant';
import { IKafkaProducerOptions } from './kafka.producer.interface';

@Injectable()
export class KafkaProducerService implements OnApplicationBootstrap {
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
        topics.forEach((topic) =>
            this.clientKafka.subscribeToResponseOf(topic.toLowerCase())
        );

        await this.clientKafka.connect();

        this.logger.log('Kafka Client Connected');
    }

    async send<T>(
        topic: string,
        data: T,
        options?: IKafkaProducerOptions
    ): Promise<Observable<IResponseKafka>> {
        const request: IRequestKafka<T> = {
            key: await this.createId(),
            value: data,
            headers: options && options.headers ? options.headers : undefined,
        };

        return this.clientKafka.send<any, IRequestKafka<T>>(topic, request);
    }

    async emit<T>(
        topic: string,
        data: T,
        options?: IKafkaProducerOptions
    ): Promise<Observable<IResponseKafka>> {
        const request: IRequestKafka<T> = {
            key: await this.createId(),
            value: data,
            headers: options && options.headers ? options.headers : undefined,
        };

        return this.clientKafka.emit<any, IRequestKafka<T>>(topic, request);
    }

    private async createId(): Promise<string> {
        const rand: string = await this.helperService.stringRandom(10);
        const timestamp = `${new Date().valueOf()}`;
        return `${timestamp}-${rand}`;
    }
}
