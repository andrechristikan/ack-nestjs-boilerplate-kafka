import {
    Inject,
    Injectable,
    Logger,
    OnApplicationBootstrap,
    OnModuleDestroy,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientKafka } from '@nestjs/microservices';
import { firstValueFrom, lastValueFrom, timeout } from 'rxjs';
import { Helper } from 'src/helper/helper.decorator';
import { HelperService } from 'src/helper/helper.service';
import { IRequestKafka } from 'src/request/request.interface';
import { IResponseKafka } from 'src/response/response.interface';
import { KAFKA_TOPICS_SUBSCRIBE } from '../kafka.constant';
import {
    ENUM_KAFKA_PRODUCER_ACKS,
    KAFKA_PRODUCER_INSYNC_SERVICE_NAME,
    KAFKA_PRODUCER_LEADER_SYNC_SERVICE_NAME,
} from './kafka.producer.constant';
import { IKafkaProducerOptions } from './kafka.producer.interface';

@Injectable()
export class KafkaProducerService
    implements OnApplicationBootstrap, OnModuleDestroy
{
    protected logger = new Logger(KafkaProducerService.name);
    private readonly producerSend: Record<string, any>;

    constructor(
        @Helper() private readonly helperService: HelperService,
        @Inject(KAFKA_PRODUCER_INSYNC_SERVICE_NAME)
        private readonly kafkaInsync: ClientKafka,
        @Inject(KAFKA_PRODUCER_LEADER_SYNC_SERVICE_NAME)
        private readonly kafkaLeaderSync: ClientKafka,
        private readonly configService: ConfigService
    ) {
        this.producerSend =
            this.configService.get<Record<string, any>>('kafka.producerSend');
    }

    async onApplicationBootstrap(): Promise<void> {
        const topics: string[] = [...new Set(KAFKA_TOPICS_SUBSCRIBE)];
        for (const topic of topics) {
            this.kafkaInsync.subscribeToResponseOf(topic);
            this.kafkaLeaderSync.subscribeToResponseOf(topic);
        }

        await this.kafkaInsync.connect();
        await this.kafkaLeaderSync.connect();

        this.logger.log('Kafka Client Connected');
    }

    async onModuleDestroy(): Promise<void> {
        await this.kafkaInsync.close();
        await this.kafkaLeaderSync.close();
    }

    async send<T>(
        topic: string,
        data: T,
        acks: ENUM_KAFKA_PRODUCER_ACKS,
        options?: IKafkaProducerOptions
    ): Promise<IResponseKafka> {
        const request: IRequestKafka<T> = {
            key: await this.createId(),
            value: data,
            headers: options && options.headers ? options.headers : undefined,
        };

        let kafka = this.kafkaInsync;

        if (acks === ENUM_KAFKA_PRODUCER_ACKS.LEADER_SYNC) {
            kafka = this.kafkaLeaderSync;
        }

        const firstValue = await firstValueFrom(
            kafka
                .send<any, IRequestKafka<T>>(topic, request)
                .pipe(timeout(this.producerSend.timeout))
        );
        const lastValue = await lastValueFrom(
            kafka
                .send<any, IRequestKafka<T>>(topic, request)
                .pipe(timeout(this.producerSend.timeout))
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
