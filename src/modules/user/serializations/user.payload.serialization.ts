import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { ResponseIdSerialization } from 'src/common/response/serializations/response.id.serialization';
import { ENUM_ROLE_TYPE } from 'src/common/role/constants/role.enum.constant';

export class UserPayloadSerialization extends ResponseIdSerialization {
    @ApiProperty({
        example: faker.internet.userName(),
    })
    readonly username: string;

    @ApiProperty({
        example: faker.name.firstName(),
    })
    readonly firstName: string;

    @ApiProperty({
        example: faker.name.lastName(),
    })
    readonly lastName: string;

    @ApiProperty({
        example: faker.datatype.uuid(),
        type: 'string',
    })
    readonly role: string;

    @ApiProperty({
        example: ENUM_ROLE_TYPE.ADMIN,
        type: 'string',
        enum: ENUM_ROLE_TYPE,
    })
    readonly type: ENUM_ROLE_TYPE;

    readonly loginDate: Date;
}
