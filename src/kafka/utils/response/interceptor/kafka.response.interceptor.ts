import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { RpcArgumentsHost } from '@nestjs/common/interfaces';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class KafkaResponseInterceptor implements NestInterceptor<Promise<any>> {
    async intercept(
        context: ExecutionContext,
        next: CallHandler
    ): Promise<Observable<Promise<any> | string>> {
        if (context.getType() === 'rpc') {
            const ctx: RpcArgumentsHost = context.switchToRpc();
            const { headers, key } = ctx.getData();

            return next
                .handle()
                .pipe(
                    map((response: Record<string, any>) =>
                        JSON.stringify({ headers, key, value: response })
                    )
                );
        }

        return next.handle();
    }
}
