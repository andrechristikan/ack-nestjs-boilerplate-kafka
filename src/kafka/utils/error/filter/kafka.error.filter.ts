import { ArgumentsHost, Catch } from '@nestjs/common';
import {
    RpcArgumentsHost,
    RpcExceptionFilter,
} from '@nestjs/common/interfaces';
import { RpcException } from '@nestjs/microservices';
import { Observable, throwError } from 'rxjs';
import { DebuggerService } from 'src/debugger/service/debugger.service';

@Catch(RpcException)
export class KafkaErrorFilter implements RpcExceptionFilter<RpcException> {
    constructor(private readonly debuggerService: DebuggerService) {}

    catch(exception: RpcException, host: ArgumentsHost): Observable<any> {
        const ctx: RpcArgumentsHost = host.switchToRpc();
        const { __class, key, __function } = ctx.getData();

        // Debugger
        this.debuggerService.error(
            key ? key : KafkaErrorFilter.name,
            {
                description: exception.message,
                class: __class,
                function: __function,
            },
            exception
        );

        return throwError(() => JSON.stringify(exception.getError()));
    }
}
