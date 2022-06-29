import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class KafkaResponseInterceptor implements NestInterceptor<Promise<any>> {
    async intercept(
        context: ExecutionContext,
        next: CallHandler
    ): Promise<Observable<Promise<any> | string>> {
        if (context.getType() === 'rpc') {
            return next
                .handle()
                .pipe(
                    map((response: Record<string, any>) =>
                        JSON.stringify(response)
                    )
                );
        }

        return next.handle();
    }
}
