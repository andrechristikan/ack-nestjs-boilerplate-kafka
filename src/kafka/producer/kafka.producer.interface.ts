import { IRequestKafkaHeader } from 'src/request/request.interface';

export interface IKafkaProducerOptions {
    headers?: IRequestKafkaHeader;
}
