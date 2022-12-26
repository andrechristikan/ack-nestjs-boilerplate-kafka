import { registerAs } from '@nestjs/config';

export default registerAs(
    'user',
    (): Record<string, any> => ({
        mobileNumberCountryCodeAllowed: ['628', '658'],
    })
);
