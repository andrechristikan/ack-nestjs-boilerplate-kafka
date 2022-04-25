import {
    applyDecorators,
    createParamDecorator,
    ExecutionContext,
    UseFilters,
    UsePipes,
    ValidationError,
    ValidationPipe,
} from '@nestjs/common';
import { MessagePattern, RpcException, Transport } from '@nestjs/microservices';
import { ErrorRcpFilter } from 'src/utils/error/error.filter';
import { ENUM_REQUEST_STATUS_CODE_ERROR } from 'src/utils/request/request.constant';

export function MessageTopic(topic: string): any {
    return applyDecorators(
        MessagePattern(topic, Transport.KAFKA),
        UsePipes(
            new ValidationPipe({
                transform: true,
                skipNullProperties: false,
                skipUndefinedProperties: false,
                skipMissingProperties: false,
                exceptionFactory: async (errors: ValidationError[]) => {
                    return new RpcException({
                        statusCode:
                            ENUM_REQUEST_STATUS_CODE_ERROR.REQUEST_VALIDATION_ERROR,
                        message: 'http.clientError.unprocessableEntity',
                        errors,
                    });
                },
            })
        ),
        UseFilters(new ErrorRcpFilter())
    );
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
