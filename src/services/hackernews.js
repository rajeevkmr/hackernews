import {apiGet, apiPost} from './common';


/* export const getTopStories = (refresh_token) => {
    return apiPost(`/auth/customer-refresh-token?refresh_token=${refresh_token}`);
} */

export const getTopStories = () => {
    return apiGet('/topstories.json');
}

export const getStoryDetail = (id) => {
    return apiGet(`/item/${id}.json`);
}

export const getComment = (id) => {
    return apiGet(`/item/${id}.json`);
}
