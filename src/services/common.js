import fetch from 'unfetch';
import i18n from '../i18n';
import {toast} from 'react-toastify';

// import {refreshAccessToken} from './auth';
import {getApiEndpoint, getApiSecretKey} from '../utils';
import {store} from '../store';
import {setAuthState, resetUserInfo, saveUserInfo} from '../store/actions/auth';


let apiRequest = null;
let toastId = null;

export const apiGet = (path, data, token = null, endpoint) => {
    return handleRefreshToken(path, data, 'GET', token, endpoint);
}

export const apiPost = (path, data, method = 'POST', token = null, endpoint) => {
    return handleRefreshToken(path, data, method, token, endpoint);
}

const handleRefreshToken = (path, data, method, token, endpoint) => {
    const isExpired = checkTokenExpired();
    if (isExpired && token) {
        if (apiRequest) { // If promise already exist then wait to action
            return apiRequest.then(() => {
                const newToken = store.getState().auth.token;
                if (method === 'GET') {
                    return doApiGet(path, data, newToken, endpoint);
                } else {
                    return doApiPost(path, data, method, newToken, endpoint);
                }
            });
        } else {
            const refreshToken = store.getState().auth.refresh_token;
            apiRequest = null;
            return apiRequest.then(res => {
                if (!res || (res && res.error)) 
                    return;
                


                const newToken = token ? res.data.token : null;
                // Save user info to store
                store.dispatch(saveUserInfo(res.data));
                apiRequest = null;
                if (method === 'GET') {
                    return doApiGet(path, data, newToken, endpoint);
                } else {
                    return doApiPost(path, data, method, newToken, endpoint);
                }
            });
        }
    } else {
        const newToken = token ? store.getState().auth.token : null;
        if (method === 'GET') {
            return doApiGet(path, data, newToken, endpoint);
        } else {
            return doApiPost(path, data, method, newToken, endpoint);
        }
    }
}

const doApiGet = (path, data, token, endpoint) => {
    const url = getApiEndpoint(endpoint);
    const secretKey = getApiSecretKey(endpoint);
    const lang = 'en';
    const queryParams = data ? `&${
        Object.keys(data).map(key => `${key}=${
            encodeURIComponent(data[key])
        }`).join('&')
    }` : '';
    const options = token ? {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${
                token.accessToken || token
            }`
        }
    } : {
        method: 'GET'
    };
    return fetch(`${url}${path}?secret_key=${secretKey}${queryParams}&lang=${lang}`, options).then(rejectErrors).then(res => res.json()).then(json => json || null).catch(err => {
        if (err.message ?. general && (err.message.general.code === 'token_invalid_rule_error' || err.message.general.code === 'token_expired_rule_error')) {
            if (! toastId) {
                toastId = toast.error(i18n.t('ERROR_CUSTOM_CODE.REFRESH_TOKEN_LOGOUT'));
                setTimeout(() => {
                    toastId = null;
                }, 500);
            }
            store.dispatch(setAuthState(false));
            store.dispatch(resetUserInfo());

            apiRequest = null;
        } else {

            apiRequest = null;
            throw err;
        }
    });
}

const doApiPost = (path, data, method, token, endpoint) => {
    const url = getApiEndpoint(endpoint);
    const secretKey = getApiSecretKey(endpoint);
    const lang = 'en';
    const options = {
        method,
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        }
    };
    const newData = data || {};
    newData.lang = lang;
    options.body = JSON.stringify(newData);
    if (token) {
        options.headers['Authorization'] = `Bearer ${token}`;
    }
    return fetch(`${url}${path}${
        path.indexOf('?') > -1 ? '&' : '?'
    }secret_key=${secretKey}`, options).then(rejectErrors).then(res => res.json()).then(json => json || null).catch(err => {
        if (err.message && (err.message.general.code === 'token_invalid_rule_error' || err.message.general.code === 'token_expired_rule_error')) {
            if (! toastId) {
                toastId = toast.error(i18n.t('ERROR_CUSTOM_CODE.REFRESH_TOKEN_LOGOUT'));
                setTimeout(() => {
                    toastId = null;
                }, 500);
            }
            store.dispatch(setAuthState(false));
            store.dispatch(resetUserInfo());
            apiRequest = null;
        } else {
            apiRequest = null;
            throw err;
        }
    });
}

const checkTokenExpired = () => {
    const tokenExpireAt = store.getState().auth.token_expires_at;
    const now = new Date().getTime();
    if (now >= tokenExpireAt) {
        return true;
    }
    return false;
}

const rejectErrors = async res => {
    const {status} = res;
    if (status >= 200 && status < 300) {
        return res;
    }
    const ret = await res.json();
    return Promise.reject({
        message: ret.message || res.statusText,
        status
    });
}

export const apiPostFormData = (path, data, method = 'POST', token = null, endpoint) => {
    const url = getApiEndpoint(endpoint);
    const body = new FormData();
    for (let key in data) {
        body.append(key, data[key]);
    }
    const options = {
        method,
        headers: {},
        body
    };
    if (token) {
        options.headers['Authorization'] = `Bearer ${token}`;
    }
    return fetch(`${url}${path}`, options).then(rejectErrors).then(res => res.json()).then(json => json || null).catch(err => {
        if (err.message && err.message.general.code === 'token_expired_rule_error') { // Handle refresh token
            if (apiRequest) {
                apiRequest.then(() => {
                    const newToken = store.getState().auth.token;
                    apiPost(path, data, method, newToken, endpoint);
                });
                return;
            }
            const refreshToken = store.getState().auth.refresh_token;
            apiRequest = null
            apiRequest.then(res => {
                apiPost(path, data, method, res.data.token, endpoint);
                // Save user info
                store.dispatch(saveUserInfo(res.data));
                apiRequest = null;
            })
        } else if (err.message && err.message.general.code === 'token_invalid_rule_error') {
            toast.error(i18n.t('ERROR_CUSTOM_CODE.REFRESH_TOKEN_LOGOUT'));
            store.dispatch(setAuthState(false));
            store.dispatch(resetUserInfo());
            apiRequest = null;
        } else {
            apiRequest = null;
            throw err;
        }
    });
}

export const externalPost = url => {
    return fetch(url, {method: 'POST'}).then(rejectErrors).then(res => res.json()).then(json => json || null).catch(err => {
        throw err;
    });
}
