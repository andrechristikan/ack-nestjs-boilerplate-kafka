import { NestApplication, NestFactory } from '@nestjs/core';
import { Logger, VersioningType } from '@nestjs/common';
import { AppModule } from 'src/app/app.module';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
    const app: NestApplication = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);
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

    // Versioning
    if (versioning) {
        app.enableVersioning({
            type: VersioningType.URI,
        });
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

    // kafka
    if (env !== 'testing') {
        const brokers: string[] = configService.get<string[]>('kafka.brokers');
        const clientId: string = configService.get<string>('kafka.clientId');
        const consumerGroup: string = configService.get<string>(
            'kafka.consumerGroup'
        );
        const retries: number = configService.get<number>('kafka.retries');

        app.connectMicroservice<MicroserviceOptions>({
            transport: Transport.KAFKA,
            options: {
                client: {
                    clientId,
                    brokers,
                },
                consumer: {
                    groupId: consumerGroup,
                    allowAutoTopicCreation: false,
                    retry: {
                        retries: retries,
                    },
                },
            },
        });

        await app.startAllMicroservices();
        logger.log(
            `Kafka server connected on brokers ${brokers.join(', ')}`,
            'NestApplication'
        );
    }
}
bootstrap();
