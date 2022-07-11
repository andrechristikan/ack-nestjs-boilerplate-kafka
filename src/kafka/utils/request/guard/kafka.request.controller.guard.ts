import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
    ERROR_CLASS_META_KEY,
    ERROR_FUNCTION_META_KEY,
} from 'src/utils/error/error.constant';

@Injectable()
export class KafkaRequestControllerGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const data = context.switchToRpc().getData();
        const cls = this.reflector.get<string>(
            ERROR_CLASS_META_KEY,
            context.getHandler()
        );
        const func = this.reflector.get<string>(
            ERROR_FUNCTION_META_KEY,
            context.getHandler()
        );

        const className = context.getClass().name;
        const methodKey = context.getHandler().name;

        data.__class = cls || className;
        data.__function = func || methodKey;

        return true;
    }
}
