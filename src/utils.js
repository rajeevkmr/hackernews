import {
    ENV,
    API_BASE_QA,
    API_BASE_STG,
    API_BASE_PROD,
    API_SECRET_KEY_STG,
    API_SECRET_KEY_PROD,
    API_SECRET_KEY_QA
} from 'constants/api';

export const getApiEndpoint = () => {
    switch (ENV) {
        case 'STG':
            return API_BASE_STG;
        case 'PROD':
            return API_BASE_PROD;
        default:
            return API_BASE_QA;
    }
};

export const getApiSecretKey = () => {
    switch (ENV) {
        case 'STG':
            return API_SECRET_KEY_STG;
        case 'PROD':
            return API_SECRET_KEY_PROD;
        default:
            return API_SECRET_KEY_QA;
    }

};
