import {
    applyDecorators,
    createParamDecorator,
    ExecutionContext,
} from '@nestjs/common';
import { MessagePattern, Transport } from '@nestjs/microservices';

export function MessageTopic(topic: string): any {
    return applyDecorators(MessagePattern(topic, Transport.KAFKA));
}

export const MessageValue = createParamDecorator(
    (data: string, ctx: ExecutionContext): Record<string, any> => {
        const context = ctx.switchToRpc().getData();
        return context.value;
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
