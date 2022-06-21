import {
    ArgumentMetadata,
    Injectable,
    ValidationError,
    ValidationPipe,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { ENUM_REQUEST_STATUS_CODE_ERROR } from 'src/utils/request/request.constant';

@Injectable()
export class KafkaRequestValidationPipe extends ValidationPipe {
    constructor() {
        super({
            transform: true,
            skipNullProperties: false,
            skipUndefinedProperties: false,
            skipMissingProperties: false,
            exceptionFactory: async (errors: ValidationError[]) =>
                new RpcException({
                    statusCode:
                        ENUM_REQUEST_STATUS_CODE_ERROR.REQUEST_VALIDATION_ERROR,
                    message: 'http.clientError.unprocessableEntity',
                    errors,
                }),
        });
    }

    async transform(value: any, metadata: ArgumentMetadata): Promise<any> {
        return await super.transform(value, { ...metadata, type: 'body' });
    }
}
