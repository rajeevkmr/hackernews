import {combineReducers} from 'redux';
import {persistReducer} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import {auth} from './auth';
import {hackernews} from './hackernews';
import {config} from './config';

const configPersistConfig = {
    key: 'config',
    storage,
    blacklist: ['position']
};

export default combineReducers({
    auth,
    hackernews,
    config: persistReducer(configPersistConfig, config)
});
