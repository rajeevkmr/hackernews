export const ENV = process.env.NODE_ENV === 'production' ? 'PROD' : 'QA';
// Dev
// export const API_BASE_QA = 'https://donut-dot-hottab-in.appspot.com/v3';                     // Dev

export const API_BASE_QA = 'https://hacker-news.firebaseio.com/v0';
export const API_BASE_STG = 'https://hacker-news.firebaseio.com/v0';
export const API_BASE_PROD = 'https://hacker-news.firebaseio.com/v0';

export const api = {
    item: 'item',
    topstories: '',
    comments: 'item'
}

export const API_SECRET_KEY_QA = 'VNL597QypdptbydjBt3jT4yxaYSQYNGe7EWCavXCYZQ6gZ9Z'; // Dev
export const API_SECRET_KEY_STG = 'qbktxJY33PKha53jkCpdu6CkFJNZvqds'; // Staging
export const API_SECRET_KEY_PROD = 'VNL597QypdptbydjBt3jT4yxaYSQYNGe7EWCavXCYZQ6gZ9Z'; // Production
