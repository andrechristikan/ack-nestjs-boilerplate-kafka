import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { MessageService } from 'src/message/service/message.service';
import { ErrorHttpFilter, ErrorRcpFilter } from './error.filter';

@Module({
    controllers: [],
    providers: [
        {
            provide: APP_FILTER,
            inject: [MessageService],
            useFactory: (messageService: MessageService) => {
                return new ErrorHttpFilter(messageService);
            },
        },
        {
            provide: APP_FILTER,
            inject: [],
            useFactory: () => {
                return new ErrorRcpFilter();
            },
        },
    ],
    imports: [],
})
export class ErrorModule {}
