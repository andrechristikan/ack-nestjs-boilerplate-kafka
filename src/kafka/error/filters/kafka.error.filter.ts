import { ArgumentsHost, Catch, Optional } from '@nestjs/common';
import {
    RpcArgumentsHost,
    RpcExceptionFilter,
} from '@nestjs/common/interfaces';
import { KafkaContext, RpcException } from '@nestjs/microservices';
import { of, Observable } from 'rxjs';
import { DebuggerService } from 'src/common/debugger/services/debugger.service';

@Catch(RpcException)
export class KafkaErrorFilter implements RpcExceptionFilter<RpcException> {
    constructor(
        @Optional() private readonly debuggerService: DebuggerService
    ) {}

    catch(exception: RpcException, host: ArgumentsHost): Observable<any> {
        const ctx: RpcArgumentsHost = host.switchToRpc();
        const { __class, __function } = ctx.getData();
        const { key } = ctx.getContext<KafkaContext>().getMessage();

        // Debugger
        try {
            this.debuggerService.error(
                key ? key.toString() : KafkaErrorFilter.name,
                {
                    description: exception.message,
                    class: __class,
                    function: __function,
                },
                exception
            );
        } catch (err: unknown) {}

        return of(JSON.stringify({ error: exception.getError() }));
    }
}
