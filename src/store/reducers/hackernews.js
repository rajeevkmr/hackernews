import {deepCloneObject} from 'utils';

export const initialState = {
    topStories: [],
    comments: []
}

export const hackernews = (state = initialState, action) => {
    console.log(action.type, action);
    switch (action.type) {
        case 'story/addStories':
            return {
                ...state,
                topStories: action.data
            };
        case 'story/addComments':
            return {
                ...state,
                comments: {
                    ...state.comments,
                    ...action.data
                }
            };
        default:
            return state;
    }
}
