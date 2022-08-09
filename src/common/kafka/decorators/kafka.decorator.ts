import {
    applyDecorators,
    createParamDecorator,
    ExecutionContext,
    UseFilters,
    UseInterceptors,
    UsePipes,
} from '@nestjs/common';
import {
    KafkaContext,
    MessagePattern,
    Payload,
    Transport,
} from '@nestjs/microservices';
import { KafkaErrorFilter } from '../error/filters/kafka.error.filter';
import { KafkaResponseInterceptor } from '../interceptors/kafka.response.interceptor';
import { KafkaResponseTimeoutInterceptor } from '../interceptors/kafka.response.timeout.interceptor';
import { KafkaValidationPipe } from '../pipes/kafka.validation.pipe';

export function MessageTopic(topic: string): any {
    return applyDecorators(
        MessagePattern(topic, Transport.KAFKA),
        UseInterceptors(
            KafkaResponseInterceptor,
            KafkaResponseTimeoutInterceptor
        ),
        UseFilters(KafkaErrorFilter),
        UsePipes(KafkaValidationPipe)
    );
}

export const MessageValue = Payload;

export const MessageHeader = createParamDecorator<Record<string, any> | string>(
    (field: string, ctx: ExecutionContext): Record<string, any> => {
        const context: KafkaContext = ctx.switchToRpc().getContext();
        const headers: Record<string, any> = context.getMessage().headers;
        return field ? headers[field] : headers;
    }
);

export const MessageKey = createParamDecorator<string>(
    (field: string, ctx: ExecutionContext): string => {
        const context: KafkaContext = ctx.switchToRpc().getContext();
        const key: string = context.getMessage().key.toString();
        return key;
    }
);
