import { IncomingMessage } from 'http';

export type IResponse = Record<string, any>;
export type IResponseKafka = IncomingMessage;

export interface IResponsePaging {
    totalData: number;
    totalPage: number;
    currentPage: number;
    perPage: number;
    data: Record<string, any>[];
}
