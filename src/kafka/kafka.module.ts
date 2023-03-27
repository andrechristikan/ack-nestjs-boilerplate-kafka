import { DynamicModule, Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ProducerConfig } from 'kafkajs';
import { KAFKA_SERVICE_NAME } from './constants/kafka.constant';
import { KafkaRouterModule } from './router/kafka.router.module';
import { KafkaAdminService } from './services/kafka.admin.service';
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

@Module({
    providers: [KafkaAdminService],
    exports: [KafkaAdminService],
    controllers: [],
    imports: [],
})
export class KafkaAdminModule {}

@Module({})
export class KafkaCommonModule {
    static register(): DynamicModule {
        const imports = [];
        if (process.env.KAFKA_CONSUMER_ENABLE === 'true') {
            imports.push(KafkaRouterModule);
        }

        return {
            module: KafkaCommonModule,
            providers: [],
            exports: [],
            controllers: [],
            imports: [KafkaModule, ...imports],
        };
    }
}
