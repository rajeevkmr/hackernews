export const changeLanguage = lang => ({type: 'config/setLanguage', lang});

export const savePosition = position => ({type: 'config/savePosition', position});

export const saveLanguages = languages => ({type: 'config/saveLanguages', languages});

export const updateKeyword = keyword => ({type: 'config/updateKeyword', keyword});

export const saveOrderType = orderType => ({type: 'config/saveOrderType', orderType});

export const saveQuickAccess = id => ({type: 'config/saveQuickAccess', id});

export const updateCustomerPosition = position => ({type: 'config/updateCustomerPosition', position});

export const saveCity = id => ({type: 'config/saveCity', id});
export const saveDistrict = data => ({type: 'config/saveDistrict', data});

export const saveOrderFeedbackOption = data => ({type: 'config/saveOrderFeedbackOption', data});

export const toggleCart = () => ({type: 'config/toggleCart'});

export const changePaymentMethod = method => ({type: 'config/changePaymentMethod', method});

export const changeDistance = distance => ({type: 'config/changeDistance', distance});
export const changeCountryCode = code => ({type: 'config/changeCountryCode', code});
