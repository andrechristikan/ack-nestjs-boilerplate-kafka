import { Module } from '@nestjs/common';
import { CoreModule } from 'src/core/core.module';
import { KafkaModule } from 'src/kafka/kafka.module';
import { TaskModule } from 'src/task/task.module';
import { AppRouterModule } from './app.router.module';

@Module({
    controllers: [],
    providers: [],
    imports: [
        // Core
        CoreModule,

        // Task
        TaskModule.register(),

        // Kafka
        KafkaModule.register(),

        // Router
        AppRouterModule.register(),
    ],
})
export class AppModule {}
