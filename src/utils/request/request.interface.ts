import { Request } from 'express';
import { IResult } from 'ua-parser-js';

export interface IRequestApp extends Request {
    userAgent: IResult;
}

export interface IRequestKafkaHeader {
    user?: string;
}

export interface IRequestKafka<T = Record<string, string>> {
    key: string;
    value: T;
    headers?: IRequestKafkaHeader;
}
