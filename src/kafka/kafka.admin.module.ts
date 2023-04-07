import { Module } from '@nestjs/common';
import { KafkaAdminService } from 'src/kafka/services/kafka.admin.service';

@Module({
    providers: [KafkaAdminService],
    exports: [KafkaAdminService],
    controllers: [],
    imports: [],
})
export class KafkaAdminModule {}
