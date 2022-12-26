import { ENUM_AUTH_ACCESS_FOR } from 'src/common/auth/constants/auth.enum.constant';

export const E2E_USER_ACCESS_TOKEN_PAYLOAD_TEST = {
    role: '613ee8e5b2fdd012b94484cb',
    accessFor: ENUM_AUTH_ACCESS_FOR.SUPER_ADMIN,
    phoneNumber: '628123123112',
    email: 'test@kadence.com',
    _id: '613ee8e5b2fdd012b94484ca',
    rememberMe: false,
    loginWith: 'EMAIL',
    loginDate: '2021-9-13',
};

export const E2E_USER_PERMISSION_TOKEN_PAYLOAD_TEST = {
    permissions: [],
    _id: '613ee8e5b2fdd012b94484ca',
};
