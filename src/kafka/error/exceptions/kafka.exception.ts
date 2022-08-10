import { HttpException } from '@nestjs/common';
import { IKafkaErrorException } from '../../kafka.interface';

export class KafkaException extends HttpException {
    constructor({ statusHttp, ...data }: IKafkaErrorException) {
        super(data, statusHttp);
    }
}
