import { Module } from '@nestjs/common';
import { CoreModule } from 'src/core/core.module';
import { KafkaModule } from 'src/kafka/kafka.module';
import { TaskScheduleModule } from 'src/task-schedule/task-schedule.module';
import { AppRouterModule } from './app.router.module';

@Module({
    controllers: [],
    providers: [],
    imports: [
        // Core
        CoreModule,

        // Task
        TaskScheduleModule.register(),

        // Kafka
        KafkaModule.register(),

        // Router
        AppRouterModule.register(),
    ],
})
export class AppModule {}
