import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable, throwError, TimeoutError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';
import { RpcException } from '@nestjs/microservices';
import { ENUM_ERROR_STATUS_CODE_ERROR } from 'src/common/error/constants/error.status-code.constant';

@Injectable()
export class KafkaResponseTimeoutInterceptor
    implements NestInterceptor<Promise<any>>
{
    private readonly timeout: number;

    constructor(private readonly configService: ConfigService) {
        this.timeout = this.configService.get<number>(
            'kafka.producerSend.timeout'
        );
    }

    async intercept(
        context: ExecutionContext,
        next: CallHandler
    ): Promise<Observable<Promise<any> | string>> {
        return next.handle().pipe(
            timeout(this.timeout),
            catchError((err) => {
                if (err instanceof TimeoutError) {
                    throw new RpcException({
                        statusCode:
                            ENUM_ERROR_STATUS_CODE_ERROR.ERROR_REQUEST_TIMEOUT,
                        message: 'http.clientError.requestTimeOut',
                    });
                }
                return throwError(() => err);
            })
        );

        return next.handle();
    }
}
