import {
    HttpStatus,
    Injectable,
    UnprocessableEntityException,
    ValidationError,
    ValidationPipe,
} from '@nestjs/common';
import { ENUM_REQUEST_STATUS_CODE_ERROR } from 'src/utils/request/request.constant';

@Injectable()
export class RequestValidationPipe extends ValidationPipe {
    constructor() {
        super({
            transform: true,
            skipNullProperties: false,
            skipUndefinedProperties: false,
            skipMissingProperties: false,
            errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
            exceptionFactory: async (errors: ValidationError[]) =>
                new UnprocessableEntityException({
                    statusCode:
                        ENUM_REQUEST_STATUS_CODE_ERROR.REQUEST_VALIDATION_ERROR,
                    message: 'http.clientError.unprocessableEntity',
                    errors,
                }),
        });
    }
}
