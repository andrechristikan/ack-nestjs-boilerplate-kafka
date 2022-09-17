import { HttpException } from '@nestjs/common';
import { IKafkaErrorException } from 'src/kafka/interfaces/kafka.interface';

export class KafkaException extends HttpException {
    constructor({ statusHttp, ...data }: IKafkaErrorException) {
        super(data, statusHttp);
    }
}
