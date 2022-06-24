import {
    applyDecorators,
    createParamDecorator,
    ExecutionContext,
    UseFilters,
    UseInterceptors,
    UsePipes,
} from '@nestjs/common';
import { MessagePattern, Transport } from '@nestjs/microservices';
import { ErrorLogInterceptor } from 'src/utils/error/interceptor/error.log.interceptor';
import { KafkaErrorFilter } from './utils/error/filter/kafka.error.filter';
import { KafkaRequestValidationPipe } from './utils/request/pipe/request.kafka-validation.pipe';

export function MessageTopic(topic: string): any {
    return applyDecorators(
        MessagePattern(topic, Transport.KAFKA),
        UseInterceptors(ErrorLogInterceptor),
        UsePipes(KafkaRequestValidationPipe),
        UseFilters(KafkaErrorFilter)
    );
}

export const MessageValue = createParamDecorator(
    (data: string, ctx: ExecutionContext): Record<string, any> => {
        const context = ctx.switchToRpc().getData();
        return data ? context.value[data] : context.value;
    }
);

export const MessageHeader = createParamDecorator(
    (data: string, ctx: ExecutionContext): Record<string, any> => {
        const context = ctx.switchToRpc().getData();
        return data ? context.headers[data] : context.headers;
    }
);

export const MessageKey = createParamDecorator(
    (data: string, ctx: ExecutionContext): string => {
        const context = ctx.switchToRpc().getData();
        return context.key;
    }
);
