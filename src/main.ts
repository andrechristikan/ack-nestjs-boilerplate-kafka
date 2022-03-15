import { NestApplication, NestFactory } from '@nestjs/core';
import { Logger, VersioningType } from '@nestjs/common';
import { AppModule } from 'src/app/app.module';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import {
    ConsumerConfig,
    ConsumerSubscribeTopic,
} from '@nestjs/microservices/external/kafka.interface';
import { KafkaAdminService } from './kafka/admin/kafka.admin.service';

async function bootstrap() {
    const app: NestApplication = await NestFactory.create(AppModule);
    const configService = app.get<ConfigService>(ConfigService);
    const env: string = configService.get<string>('app.env');
    const tz: string = configService.get<string>('app.timezone');
    const host: string = configService.get<string>('app.http.host');
    const port: number = configService.get<number>('app.http.port');
    const versioning: boolean = configService.get<boolean>('app.versioning');

    const logger = new Logger();
    process.env.TZ = tz;
    process.env.NODE_ENV = env;

    // Global Prefix
    app.setGlobalPrefix('/api');

    // Starts listening for shutdown hooks
    app.enableShutdownHooks();

    // Versioning
    if (versioning) {
        app.enableVersioning({
            type: VersioningType.URI,
        });
    }

    // kafka
    const brokers: string[] = configService.get<string[]>('kafka.brokers');
    const clientId: string = configService.get<string>('kafka.clientId');
    if (env !== 'testing') {
        // create topics in init
        const kafkaAdminService = app.get<KafkaAdminService>(KafkaAdminService);
        await kafkaAdminService.createTopics();

        const consumer: ConsumerConfig =
            configService.get<ConsumerConfig>('kafka.consumer');
        const subscribe: ConsumerSubscribeTopic =
            configService.get<ConsumerSubscribeTopic>(
                'kafka.consumerSubscribe'
            );

        app.connectMicroservice<MicroserviceOptions>({
            transport: Transport.KAFKA,
            options: {
                client: {
                    clientId,
                    brokers,
                },
                subscribe,
                consumer,
            },
        });

        await app.startAllMicroservices();
    }

    // Listen
    await app.listen(port, host);
    logger.log(
        `Database running on ${configService.get<string>(
            'database.host'
        )}/${configService.get<string>('database.name')}`,
        'NestApplication'
    );
    logger.log(
        `Database options ${configService.get<string>('database.options')}`,
        'NestApplication'
    );
    logger.log(
        `App Versioning is ${versioning ? 'on' : 'off'}`,
        'NestApplication'
    );
    logger.log(`Server running on ${await app.getUrl()}`, 'NestApplication');

    if (env !== 'testing') {
        logger.log(
            `Kafka server ${clientId} connected on brokers ${brokers.join(
                ', '
            )}`,
            'NestApplication'
        );
    }
}
bootstrap();
