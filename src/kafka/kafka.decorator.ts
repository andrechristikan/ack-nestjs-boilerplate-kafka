import {
    applyDecorators,
    createParamDecorator,
    ExecutionContext,
    UseFilters,
    UseGuards,
    UseInterceptors,
    UsePipes,
} from '@nestjs/common';
import { KafkaContext, MessagePattern, Transport } from '@nestjs/microservices';
import { KafkaErrorFilter } from './utils/error/filter/kafka.error.filter';
import { KafkaRequestControllerGuard } from './utils/request/guard/kafka.request.controller.guard';
import { KafkaValidationPipe } from './utils/request/pipe/kafka.validation.pipe.guard';
import { KafkaResponseInterceptor } from './utils/response/interceptor/kafka.response.interceptor';
import { KafkaResponseTimeoutInterceptor } from './utils/response/interceptor/kafka.response.timeout.interceptor';

export function MessageTopic(topic: string): any {
    return applyDecorators(
        MessagePattern(topic, Transport.KAFKA),
        UseInterceptors(
            KafkaResponseInterceptor,
            KafkaResponseTimeoutInterceptor
        ),
        UsePipes(KafkaValidationPipe),
        UseFilters(KafkaErrorFilter),
        UseGuards(KafkaRequestControllerGuard)
    );
}

export const MessageValue = createParamDecorator(
    (field: string, ctx: ExecutionContext): Record<string, any> => {
        const context: KafkaContext = ctx.switchToRpc().getContext();
        const data: Record<string, any> = context.getMessage().value;
        return field ? data[field] : data;
    }
);

export const MessageHeader = createParamDecorator(
    (field: string, ctx: ExecutionContext): Record<string, any> => {
        const context: KafkaContext = ctx.switchToRpc().getContext();
        const headers: Record<string, any> = context.getMessage().headers;
        return field ? headers[field] : headers;
    }
);

export const MessageKey = createParamDecorator(
    (field: string, ctx: ExecutionContext): string => {
        const context: KafkaContext = ctx.switchToRpc().getContext();
        const key: string = context.getMessage().key.toString();
        return key;
    }
);
