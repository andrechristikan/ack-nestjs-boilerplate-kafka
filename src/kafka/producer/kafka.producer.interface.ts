import { IRequestKafkaHeader } from 'src/utils/request/request.interface';

export interface IKafkaProducerOptions {
    headers?: IRequestKafkaHeader;
}
