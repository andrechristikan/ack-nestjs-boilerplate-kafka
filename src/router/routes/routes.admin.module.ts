import { Module } from '@nestjs/common';
import { ApiKeyModule } from 'src/common/api-key/api-key.module';
import { ApiKeyAdminController } from 'src/common/api-key/controllers/api-key.admin.controller';
import { AuthModule } from 'src/common/auth/auth.module';
import { RoleAdminController } from 'src/common/role/controllers/role.admin.controller';
import { RoleModule } from 'src/common/role/role.module';
import { SettingAdminController } from 'src/common/setting/controllers/setting.admin.controller';

@Module({
    controllers: [
        SettingAdminController,
        ApiKeyAdminController,
        RoleAdminController,
    ],
    providers: [],
    exports: [],
    imports: [ApiKeyModule, AuthModule, RoleModule],
})
export class RoutesAdminModule {}
