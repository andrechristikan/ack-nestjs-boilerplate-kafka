import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { AwsModule } from 'src/common/aws/aws.module';
import { MessageController } from 'src/common/message/controllers/message.controller';
import { SettingController } from 'src/common/setting/controllers/setting.controller';
import { HealthController } from 'src/health/controllers/health.controller';
import { HealthModule } from 'src/health/health.module';

@Module({
    controllers: [HealthController, SettingController, MessageController],
    providers: [],
    exports: [],
    imports: [AwsModule, HealthModule, TerminusModule,],
})
export class RoutesModule {}
