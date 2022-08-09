import {
    HttpStatus,
    Injectable,
    ValidationError,
    ValidationPipe,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { ENUM_REQUEST_STATUS_CODE_ERROR } from 'src/common/request/constants/request.status-code.constant';

@Injectable()
export class KafkaValidationPipe extends ValidationPipe {
    constructor() {
        super({
            transform: true,
            skipNullProperties: false,
            skipUndefinedProperties: false,
            skipMissingProperties: false,
            exceptionFactory: (errors: ValidationError[]) =>
                new RpcException({
                    statusCode:
                        ENUM_REQUEST_STATUS_CODE_ERROR.REQUEST_VALIDATION_ERROR,
                    message: 'http.clientError.unprocessableEntity',
                    errors,
                    statusHttp: HttpStatus.UNPROCESSABLE_ENTITY,
                }),
        });
    }
}
