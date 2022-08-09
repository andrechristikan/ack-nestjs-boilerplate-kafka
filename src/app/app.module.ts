import { Module } from '@nestjs/common';
import { JobsModule } from 'src/jobs/jobs.module';
import { AppController } from './controllers/app.controller';
import { RouterModule } from 'src/router/router.module';
import { CommonModule } from 'src/common/common.module';
import { KafkaModule } from 'src/common/kafka/kafka.module';

@Module({
    controllers: [AppController],
    providers: [],
    imports: [
        CommonModule,

        // Kafka
        KafkaModule.register(),

        // Jobs
        JobsModule.register(),

        // Routes
        RouterModule.register(),
    ],
})
export class AppModule {}
