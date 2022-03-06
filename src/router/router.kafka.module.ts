import { DynamicModule, Module } from '@nestjs/common';

@Module({})
export class RouterKafkaModule {
    static register({ env }): DynamicModule {
        if (env === 'testing') {
            return {
                module: RouterKafkaModule,
                providers: [],
                exports: [],
                controllers: [],
                imports: [],
            };
        }

        return {
            module: RouterKafkaModule,
            controllers: [],
            providers: [],
            exports: [],
            imports: [],
        };
    }
}
