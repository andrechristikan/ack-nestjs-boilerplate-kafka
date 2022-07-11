import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable, throwError, TimeoutError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';
import { ENUM_STATUS_CODE_ERROR } from 'src/utils/error/error.constant';
import { RpcException } from '@nestjs/microservices';

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
        if (context.getType() === 'rpc') {
            return next.handle().pipe(
                timeout(this.timeout),
                catchError((err) => {
                    if (err instanceof TimeoutError) {
                        throw new RpcException({
                            statusCode: ENUM_STATUS_CODE_ERROR.REQUEST_TIMEOUT,
                            message: 'http.clientError.requestTimeOut',
                        });
                    }
                    return throwError(() => err);
                })
            );
        }

        return next.handle();
    }
}
