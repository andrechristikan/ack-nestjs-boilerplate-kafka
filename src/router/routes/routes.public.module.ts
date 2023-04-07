import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { AuthModule } from 'src/common/auth/auth.module';
import { MessagePublicController } from 'src/common/message/controllers/message.public.controller';
import { RoleModule } from 'src/common/role/role.module';
import { SettingPublicController } from 'src/common/setting/controllers/setting.public.controller';
import { HealthPublicController } from 'src/health/controllers/health.public.controller';
import { HealthModule } from 'src/health/health.module';

@Module({
    controllers: [
        HealthPublicController,
        MessagePublicController,
        SettingPublicController,
    ],
    providers: [],
    exports: [],
    imports: [TerminusModule, HealthModule, AuthModule, RoleModule],
})
export class RoutesPublicModule {}
