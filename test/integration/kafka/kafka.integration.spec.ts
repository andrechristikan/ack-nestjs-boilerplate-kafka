import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { INTEGRATION_KAFKA_URL } from './kafka.constant';
import { CommonModule } from 'src/common/common.module';
import { RoutesModule } from 'src/router/routes/routes.module';

describe('Kafka Integration', () => {
    let app: INestApplication;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [CommonModule, RoutesModule],
            controllers: [],
        }).compile();

        app = moduleRef.createNestApplication();

        await app.init();
    });

    afterAll(async () => {
        jest.clearAllMocks();

        await app.close();
    });

    it(`GET ${INTEGRATION_KAFKA_URL} Success`, async () => {
        const response = await request(app.getHttpServer()).get(
            INTEGRATION_KAFKA_URL
        );

        expect(response.status).toEqual(HttpStatus.OK);
        expect(response.body.statusCode).toEqual(HttpStatus.OK);
    });
});
