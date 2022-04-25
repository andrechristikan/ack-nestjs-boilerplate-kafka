import { ArgumentMetadata, Injectable, ValidationPipe } from '@nestjs/common';

@Injectable()
export class KafkaValidationPipe extends ValidationPipe {
    public async transform(value: any, metadata: ArgumentMetadata) {
        return await super.transform(value, { ...metadata, type: 'body' });
    }
}
