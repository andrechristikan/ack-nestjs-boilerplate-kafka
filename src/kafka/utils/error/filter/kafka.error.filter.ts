import { Catch, ExceptionFilter } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Observable, throwError } from 'rxjs';

@Catch(RpcException)
export class KafkaErrorFilter implements ExceptionFilter {
    catch(exception: RpcException): Observable<any> {
        return throwError(() => JSON.stringify(exception.getError()));
    }
}
