export const setAuthState = state => ({type: 'auth/setAuthState', state});

export const saveUserInfo = data => ({type: 'auth/saveUserInfo', data});

export const resetUserInfo = () => ({type: 'auth/resetUserInfo'});

export const saveRegistrationToken = registrationToken => ({type: 'auth/saveRegistrationToken', registrationToken});

export const replaceAddress = addresses => ({type: 'auth/replaceAddress', addresses});

export const saveNotification = data => ({type: 'auth/saveNotification', data});

export const removeNotification = data => ({type: 'auth/removeNotification', data});

export const updateCustomer = data => ({type: 'auth/updateCustomer', data});

export const getWalletBalance = data => ({type: 'auth/getWalletBalance', data});

export const openChatRestaurant = data => ({type: 'auth/openRestaurant', data});
