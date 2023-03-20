import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { RpcArgumentsHost } from '@nestjs/common/interfaces';
import { KafkaContext } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class KafkaResponseInterceptor implements NestInterceptor<Promise<any>> {
    async intercept(
        context: ExecutionContext,
        next: CallHandler
    ): Promise<Observable<Promise<any> | string>> {
        const ctx: RpcArgumentsHost = context.switchToRpc();
        const { headers, key } = ctx.getContext<KafkaContext>().getMessage();

        return next.handle().pipe(
            map((response: Record<string, any>) => {
                if (response) {
                    delete response.__class;
                    delete response.__function;

                    return JSON.stringify({
                        headers,
                        key,
                        value: response,
                    });
                }

                return JSON.stringify({
                    headers,
                    key,
                    value: undefined,
                });
            })
        );
    }
}
