import { Module } from '@nestjs/common';
import { ApiKeyModule } from 'src/common/api-key/api-key.module';
import { ApiKeyUserController } from 'src/common/api-key/controllers/api-key.user.controller';
import { RoleModule } from 'src/common/role/role.module';

@Module({
    controllers: [ApiKeyUserController],
    providers: [],
    exports: [],
    imports: [ApiKeyModule, RoleModule],
})
export class RoutesUserModule {}
