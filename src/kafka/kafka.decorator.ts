import {
    applyDecorators,
    createParamDecorator,
    ExecutionContext,
    UseFilters,
    UsePipes,
} from '@nestjs/common';
import { MessagePattern, Transport } from '@nestjs/microservices';
import { ErrorRcpFilter } from 'src/utils/error/error.filter';
import { KafkaValidationPipe } from './utils/request/pipe/request.kafka-validation.pipe';

export function MessageTopic(topic: string): any {
    return applyDecorators(
        MessagePattern(topic, Transport.KAFKA),
        UsePipes(KafkaValidationPipe),
        UseFilters(new ErrorRcpFilter())
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
