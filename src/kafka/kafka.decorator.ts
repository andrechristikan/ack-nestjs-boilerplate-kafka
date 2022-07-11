import {
    applyDecorators,
    createParamDecorator,
    ExecutionContext,
    UseFilters,
    UseGuards,
    UseInterceptors,
    UsePipes,
} from '@nestjs/common';
import { MessagePattern, Transport } from '@nestjs/microservices';
import { KafkaErrorFilter } from './utils/error/filter/kafka.error.filter';
import { KafkaRequestControllerGuard } from './utils/request/guard/kafka.request.controller.guard';
import { KafkaRequestValidationPipe } from './utils/request/pipe/request.kafka-validation.pipe';
import { KafkaResponseInterceptor } from './utils/response/interceptor/kafka.response.interceptor';
import { KafkaResponseTimeoutInterceptor } from './utils/response/interceptor/kafka.response.timeout.interceptor';

export function MessageTopic(topic: string): any {
    return applyDecorators(
        MessagePattern(topic, Transport.KAFKA),
        UseInterceptors(
            KafkaResponseInterceptor,
            KafkaResponseTimeoutInterceptor
        ),
        UsePipes(KafkaRequestValidationPipe),
        UseFilters(KafkaErrorFilter),
        UseGuards(KafkaRequestControllerGuard)
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
