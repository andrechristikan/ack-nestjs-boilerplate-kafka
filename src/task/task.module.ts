import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
    controllers: [],
    providers: [],
    exports: [],
    imports: [ScheduleModule.forRoot()],
})
export class TaskModule {}
