export const initialState = {
    lang: 'en'
};

var defaultBLang = 'en'; // setting default browser language
if (defaultBLang != 'en') {
    initialState.lang = defaultBLang;
}

// console.log('initialState', initialState);
export const config = (state = initialState, action) => {
    switch (action.type) {
        default:
            return state;
    }
};
