import { Controller, Get, VERSION_NEUTRAL } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';
import {
    DiskHealthIndicator,
    HealthCheck,
    HealthCheckService,
    MemoryHealthIndicator,
    MicroserviceHealthIndicator,
    MongooseHealthIndicator,
} from '@nestjs/terminus';
import { Connection } from 'mongoose';
import { DatabaseConnection } from 'src/common/database/decorators/database.decorator';
import { Response } from 'src/common/response/decorators/response.decorator';
import { IResponse } from 'src/common/response/response.interface';
import { AwsHealthIndicator } from '../indicators/health.aws.indicator';

@Controller({
    version: VERSION_NEUTRAL,
    path: '/health',
})
export class HealthController {
    constructor(
        @DatabaseConnection() private readonly databaseConnection: Connection,
        private readonly health: HealthCheckService,
        private readonly memoryHealthIndicator: MemoryHealthIndicator,
        private readonly diskHealthIndicator: DiskHealthIndicator,
        private readonly databaseIndicator: MongooseHealthIndicator,
        private readonly awsIndicator: AwsHealthIndicator,
        private readonly microserviceIndicator: MicroserviceHealthIndicator,
        private readonly configService: ConfigService
    ) {}

    @Response('health.check')
    @HealthCheck()
    @Get('/aws')
    async checkAws(): Promise<IResponse> {
        return this.health.check([
            () => this.awsIndicator.isHealthy('awsBucket'),
        ]);
    }

    @Response('health.check')
    @HealthCheck()
    @Get('/database')
    async checkDatabase(): Promise<IResponse> {
        return this.health.check([
            () =>
                this.databaseIndicator.pingCheck('database', {
                    connection: this.databaseConnection,
                }),
        ]);
    }

    @Response('health.check')
    @HealthCheck()
    @Get('/memory-heap')
    async checkMemoryHeap(): Promise<IResponse> {
        return this.health.check([
            () =>
                this.memoryHealthIndicator.checkHeap(
                    'memoryHeap',
                    300 * 1024 * 1024
                ),
        ]);
    }

    @Response('health.check')
    @HealthCheck()
    @Get('/memory-rss')
    async checkMemoryRss(): Promise<IResponse> {
        return this.health.check([
            () =>
                this.memoryHealthIndicator.checkRSS(
                    'memoryRss',
                    300 * 1024 * 1024
                ),
        ]);
    }

    @Response('health.check')
    @HealthCheck()
    @Get('/storage')
    async checkStorage(): Promise<IResponse> {
        return this.health.check([
            () =>
                this.diskHealthIndicator.checkStorage('diskHealth', {
                    thresholdPercent: 0.75,
                    path: '/',
                }),
        ]);
    }

    @Response('health.check')
    @HealthCheck()
    @Get('/kafka')
    async kafka(): Promise<IResponse> {
        return this.health.check([
            () =>
                this.microserviceIndicator.pingCheck('kafka', {
                    transport: Transport.KAFKA,
                    timeout: 10000,
                    options: {
                        client: {
                            brokers:
                                this.configService.get<string[]>(
                                    'kafka.brokers'
                                ),
                        },
                    },
                }),
        ]);
    }
}
