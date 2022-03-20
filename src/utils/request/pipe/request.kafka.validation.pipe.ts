import { PipeTransform, ArgumentMetadata, Injectable } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { RpcException } from '@nestjs/microservices';
import { ENUM_REQUEST_STATUS_CODE_ERROR } from 'src/utils/request/request.constant';
import { DebuggerService } from 'src/debugger/service/debugger.service';

@Injectable()
export class RequestKafkaValidationPipe implements PipeTransform {
    constructor(private readonly debuggerService: DebuggerService) {}

    async transform(
        value: Record<string, any>,
        { metatype }: ArgumentMetadata
    ): Promise<Record<string, any>> {
        if (!metatype || !this.toValidate(metatype)) {
            return value;
        }

        const request = plainToInstance(metatype, value);
        this.debuggerService.debug(
            'Request Kafka Data',
            'RequestKafkaValidationPipe',
            'transform',
            request
        );

        const rawErrors: Record<string, any>[] = await validate(request);
        if (rawErrors.length > 0) {
            this.debuggerService.error(
                'Request Kafka Errors',
                'RequestKafkaValidationPipe',
                'transform',
                rawErrors
            );

            throw new RpcException({
                statusCode:
                    ENUM_REQUEST_STATUS_CODE_ERROR.REQUEST_KAFKA_VALIDATION_ERROR,
                message: 'http.clientError.unprocessableEntity',
                errors: rawErrors,
            });
        }

        return request;
    }

    private toValidate(metatype: Record<string, any>): boolean {
        const types: Record<string, any>[] = [];
        return types.includes(metatype);
    }
}
