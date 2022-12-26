import { Module } from '@nestjs/common';
import { ApiKeyModule } from 'src/common/api-key/api-key.module';
import { ApiKeyAdminController } from 'src/common/api-key/controllers/api-key.admin.controller';
import { AuthModule } from 'src/common/auth/auth.module';
import { SettingAdminController } from 'src/common/setting/controllers/setting.admin.controller';

@Module({
    controllers: [SettingAdminController, ApiKeyAdminController],
    providers: [],
    exports: [],
    imports: [ApiKeyModule, AuthModule],
})
export class RoutesAdminModule {}
