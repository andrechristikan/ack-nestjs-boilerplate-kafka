import { HttpException, HttpStatus } from '@nestjs/common';
import { ENUM_ERROR_STATUS_CODE_ERROR } from 'src/common/error/constants/error.status-code.constant';
import { IKafkaErrorException } from 'src/kafka/interfaces/kafka.interface';

export class KafkaException extends HttpException {
    constructor(exception: IKafkaErrorException) {
        if (
            'message' in exception &&
            'statusCode' in exception &&
            'statusHttp' in exception
        ) {
            const { statusHttp, ...data } = exception;
            super(data, statusHttp);
        } else {
            super(
                {
                    statusCode: ENUM_ERROR_STATUS_CODE_ERROR.ERROR_UNKNOWN,
                    message: 'http.serverError.internalServerError',
                },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}
