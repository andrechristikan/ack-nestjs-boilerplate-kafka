import {
    applyDecorators,
    SetMetadata,
    UseInterceptors,
    UsePipes,
} from '@nestjs/common';
import { RequestValidationPipe } from '../request/pipe/request.validation.pipe';
import { ResponseDefaultInterceptor } from './interceptor/response.default.interceptor';
import { ResponsePagingInterceptor } from './interceptor/response.paging.interceptor';
import { ResponseTimeoutInterceptor } from './interceptor/response.timeout.interceptor';
import { RESPONSE_CUSTOM_TIMEOUT_META_KEY } from './response.constant';
import { IResponsePagingOptions } from './response.interface';

export function Response(messagePath: string): any {
    return applyDecorators(
        UsePipes(RequestValidationPipe),
        UseInterceptors(ResponseDefaultInterceptor(messagePath))
    );
}

export function ResponsePaging(
    messagePath: string,
    options?: IResponsePagingOptions
): any {
    return applyDecorators(
        UsePipes(RequestValidationPipe),
        UseInterceptors(ResponsePagingInterceptor(messagePath, options))
    );
}

export function ResponseTimeout(seconds: string): any {
    return applyDecorators(
        SetMetadata(RESPONSE_CUSTOM_TIMEOUT_META_KEY, true),
        UseInterceptors(ResponseTimeoutInterceptor(seconds))
    );
}
