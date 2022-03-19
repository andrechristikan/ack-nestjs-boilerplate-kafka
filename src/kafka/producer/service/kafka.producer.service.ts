import {
    Inject,
    Injectable,
    Logger,
    OnApplicationBootstrap,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { KAFKA_TOPICS } from 'src/kafka/kafka.constant';
import { HelperStringService } from 'src/utils/helper/service/helper.string.service';
import { IRequestKafka } from 'src/utils/request/request.interface';
import { IResponseKafka } from 'src/utils/response/response.interface';
import { KAFKA_PRODUCER_SERVICE_NAME } from '../kafka.producer.constant';
import { IKafkaProducerOptions } from '../kafka.producer.interface';

@Injectable()
export class KafkaProducerService implements OnApplicationBootstrap {
    protected logger = new Logger(KafkaProducerService.name);

    constructor(
        private readonly helperStringService: HelperStringService,
        @Inject(KAFKA_PRODUCER_SERVICE_NAME)
        private readonly clientKafka: ClientKafka
    ) {}

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
        const rand: string = this.helperStringService.random(10);
        const timestamp = `${new Date().valueOf()}`;
        return `${timestamp}-${rand}`;
    }
}
