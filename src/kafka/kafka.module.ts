import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ProducerConfig } from 'kafkajs';
import { KAFKA_SERVICE_NAME } from './constants/kafka.constant';
import { KafkaService } from './services/kafka.service';

@Global()
@Module({
    providers: [KafkaService],
    exports: [KafkaService],
    controllers: [],
    imports: [
        ClientsModule.registerAsync([
            {
                name: KAFKA_SERVICE_NAME,
                inject: [ConfigService],
                imports: [ConfigModule],
                useFactory: async (configService: ConfigService) => ({
                    transport: Transport.KAFKA,
                    options: {
                        client: {
                            clientId:
                                configService.get<string>('kafka.clientId'),
                            brokers:
                                configService.get<string[]>('kafka.brokers'),
                        },
                        producer: {
                            ...configService.get<ProducerConfig>(
                                'kafka.producer'
                            ),
                            allowAutoTopicCreation: configService.get<boolean>(
                                'kafka.allowAutoTopicCreation'
                            ),
                        },
                    },
                }),
            },
        ]),
    ],
})
export class KafkaModule {}
