export const initialState = {
    loggedIn: false
}

export const auth = (state = initialState, action) => {
    switch (action.type) {
        case 'auth/setAuthState':
            return {
                ...state,
                loggedIn: action.state
            };
        case 'auth/saveUserInfo':
            return {
                ...state,
                ...action.data,
                token_expires_at: action.data.token_expires_in * 60000 + Date.now()
            };
        case 'auth/resetUserInfo':
            return {
                ... initialState
            };
        case 'auth/saveRegistrationToken':
            return {
                ...state,
                registration_token: action.registrationToken
            };
        default:
            return state;
    }
}
