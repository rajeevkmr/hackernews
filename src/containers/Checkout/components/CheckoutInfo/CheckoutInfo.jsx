/*global google*/
import React from 'react';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import ReactCountryFlag from 'react-country-flag';
import moment from 'moment';
import { toast } from 'react-toastify';
import { GOOGLE_CLIENT_ID_NEW, FACEBOOK_APP_ID_NEW } from 'constants/common';
import SocialButton from 'components/SocialButton';
import Popup from 'components/Popup';
import TextareaAutosize from 'react-textarea-autosize';
import CheckoutAddress from '../CheckoutAddress';
import DineIn from '../DineIn';
import LoadingIcon from 'components/LoadingIcon';
//import RadioButton from 'components/RadioButton';
import { countries, getCurrency, ORDER_TYPE, removeAccents, extractMessage, formatString, isDiscountExpire } from 'utils';
import { login, socialLogin } from 'services/auth';
import { setAuthState, saveUserInfo, getWalletBalance } from 'store/actions/auth';
import { updateOrderInfo, checkRedeemPoints } from 'store/actions/order';
import { updateCustomerPosition, changePaymentMethod, changeCountryCode } from 'store/actions/config';
import { checkPointsConversion } from 'services/order';
import { getBalance } from 'services/customer';
import { getOpenLoyaltyAccount } from 'services/customer';
import { history } from 'store';

@withTranslation('translations')
@connect(
  (state) => ({
    lang: state.config.lang,
    position: state.config.position,
    discountSettings: state.restaurant.discountSettings,
    savedDistance: state.config.savedDistance,
    isLoggedIn: state.auth.loggedIn,
    orderInfo: state.order.info,
    orderItems: state.order.items,
    customer: state.auth.customer,
    orderType: state.config.order_type,
    address: state.auth.address,
    customerLat: state.config.customerLat,
    customerLng: state.config.customerLng,
    customerAddress: state.config.customerAddress,
    paymentMethod: state.config.paymentMethod,
    balance: state.auth.balance,
    token: state.auth.token,
    redeem: state.order.redeem,
    recurringOrder: state.order.recurringOrder,
    dineIn: state.order.dineIn,
    deliveryFees: state.order.deliveryFees,
    cityId: state.config.cityId,
    filters: state.restaurant.filters,
    countryCode: state.config.countryCode
  }),
  {
    setAuthState,
    saveUserInfo,
    updateOrderInfo,
    updateCustomerPosition,
    changePaymentMethod,
    checkRedeemPoints,
    getWalletBalance,
    changeCountryCode
  }
)
class CheckoutInfo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      phone: '',
      otp: '',
      countryCode: 84,
      verifying: false,
      otpSending: false,
      btnNextDisabled: false,
      btnVerifyDisabled: false,
      authErrorMessage: '',
      address: '',
      originAddress: '',
      addressNote: '',
      showPredictions: false,
      predictions: props.address || [],
      originPredictions: props.address || [],
      mapMobileOpened: false,
      payment: 'cod',
      time: {},
      seconds: 300,
      resendSeconds: 0,
      search_country: '',
      addressToggle: '',
      addressToggleCheckout: '',
      message: '',
      orderNote: ''
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.onKeyPress = this.onKeyPress.bind(this);
    this.onFocusAddress = this.onFocusAddress.bind(this);
    this.toggleMapMobile = this.toggleMapMobile.bind(this);
    this.onChangePaymentMethod = this.onChangePaymentMethod.bind(this);
    this.handleInputChangeSearch = this.handleInputChangeSearch.bind(this);
    this.toggleAddressState = this.toggleAddressState.bind(this);
    this.checkRedeem = this.checkRedeem.bind(this);
    this.timeout = null;

    this.startTimer = this.startTimer.bind(this);
    this.countDown = this.countDown.bind(this);

    this.otpTimeout = null;
    this.resendInterval = null;

    this.otp_length = 6;
    this.timer = 0;
  }

  secondsToTime(secs) {
    let hours = Math.floor(secs / (60 * 60));

    let divisor_for_minutes = secs % (60 * 60);
    let minutes = Math.floor(divisor_for_minutes / 60);

    let divisor_for_seconds = divisor_for_minutes % 60;
    let seconds = Math.ceil(divisor_for_seconds);

    let obj = {
      h: hours,
      m: minutes,
      s: seconds
    };
    return obj;
  }

  startTimer() {
    if (this.state.seconds > 0) {
      this.timer = setInterval(this.countDown, 1000);
    }
  }

  countDown() {
    // Remove one second, set state so a re-render happens.
    let seconds = this.state.seconds - 1;
    if (seconds >= 0) {
      this.setState({
        time: this.secondsToTime(seconds),
        seconds: seconds
      });
    }
    // Check if we're at zero.
    if (seconds === 0) {
      const { t } = this.props;

      toast.error(t('ERROR_CODE.otp_timeout'));
      clearInterval(this.timer);
    }
  }
  resendOtp() {
    if (!this.resendInterval) {
      this.resendInterval = setInterval(() => {
        this.countdown();
      }, 1000);
    }
    if (this.state.resendSeconds > 0) return;
    this.setState({ resendSeconds: 30 });
    this.sendOtp();
  }

  countdown() {
    this.setState({ resendSeconds: this.state.resendSeconds - 1 }, () => {
      if (this.state.resendSeconds === 0) {
        clearInterval(this.resendInterval);
        this.resendInterval = null;
      }
    });
  }

  /*
    check sopa points redeem
    */
  checkRedeem() {
    const { totalPrice, customer, token, checkRedeemPoints } = this.props;
    let checkData = { consumer_uuid: customer.customer_uuid, amount: totalPrice };
    this.checkSopaPointsPay(checkData, token).then((res) => {
      checkRedeemPoints(res.data);
    });
  }

  //function to check sopa points redeem
  async checkSopaPointsPay(data, token) {
    return await checkPointsConversion(data, token);
  }

  componentDidMount() {
    const { isLoggedIn } = this.props;
    document.addEventListener('mousedown', this.handleClickOutside);
    //let checkBtn =  this.checkSubmitButtonDisabled();
    if (isLoggedIn) {
      this.checkRedeem();
    }
    // this.getCurrentAddress();
  }

  componentDidUpdate(prevProps) {
    //console.log('dfg');

    const { isLoggedIn, recurringOrder } = this.props;
    if (isLoggedIn && prevProps.recurringOrder.dateRange !== recurringOrder.dateRange) {
      this.checkRedeem();
    }
    if (prevProps.position !== this.props.position) {
      //   this.getCurrentAddress();
    }
    if (isLoggedIn && isLoggedIn !== prevProps.isLoggedIn) {
      // this.getTotalAmount();
      this.checkRedeem();
    }
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  getCurrentAddress() {
    const { position, updateOrderInfo, updateCustomerPosition, customerLat, customerLng, customerAddress } = this.props;
    if (customerLat && customerLng) {
      this.setState({
        address: customerAddress,
        originAddress: customerAddress
      });
      // Update order info in store
      updateOrderInfo({
        customerLat: customerLat,
        customerLng: customerLng,
        customerAddress
      });
      return;
    }
    if (!position) return;
    const latLng = {
      lat: position.latitude,
      lng: position.longitude
    };
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: latLng }, (results, status) => {
      if (status === 'OK') {
        if (results[0]) {
          const lat = results[0].geometry.location.lat();
          const lng = results[0].geometry.location.lng();
          const address = results[0].formatted_address;
          this.setState({
            address,
            originAddress: address
          });
          // Update order info in store
          updateOrderInfo({
            customerLat: lat,
            customerLng: lng,
            customerAddress: address
          });
          // Update customer position for next order
          updateCustomerPosition({ lat, lng, address });
        } else {
          console.log('No results found');
        }
      } else {
        console.log('Geocoder failed due to: ' + status);
      }
    });
  }

  handleClickOutside(event) {
    if (!event.target) {
      return;
    }
    // Click outside close panel
    if (this.countriesRef && !this.countriesRef.contains(event.target) && !this.countriesRef.contains(event.target.parentElement.nextElementSibling)) {
      this.setState({
        countriesListShow: false
      });
    }
    // Revert address
    if (this.addressRef && !this.addressRef.contains(event.target) && this.predictionsRef && !this.predictionsRef.contains(event.target)) {
      this.setState({
        address: this.state.originAddress,
        predictions: this.state.originPredictions,
        showPredictions: false
      });
    }
  }

  handleInputChangeSearch(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  }

  handleInputChange(event, isNumber) {
    const { orderInfo, updateOrderInfo, address } = this.props;
    const target = event.target;
    const value = target.value;
    const name = target.name;

    // Input number only
    if (isNumber) {
      const regex = /^[0-9\b]+$/;
      if (value !== '' && !regex.test(value)) {
        return false;
      }
    }

    // Save address note
    if (name === 'addressNote') {
      updateOrderInfo({
        addressNote: value
      });
    }
    // Save address note
    if (name === 'orderNote') {
      updateOrderInfo({
        orderNote: value
      });
    }

    if (name === 'otp' && value.length > this.otp_length) return false;

    // Address autocomplete
    if (name === 'address') {
      if (this.timeout) clearTimeout(this.timeout);
      const self = this;
      this.timeout = setTimeout(() => {
        const autocompleteService = new google.maps.places.AutocompleteService();
        const center = {
          lat: orderInfo.lat,
          lng: orderInfo.long
        };
        const circle = new google.maps.Circle({
          center,
          radius: 30000 // 30km
        });
        const bounds = circle.getBounds();
        const location = `${orderInfo.lat},${orderInfo.long}`;
        const options = {
          input: value,
          location,
          bounds
          /*  componentRestrictions: {country: "vn"} */
        };
        autocompleteService.getPlacePredictions(options, (data, status) => {
          let predictions = [];
          const matchedAddress = address.filter((item) => removeAccents(item.address.toLowerCase()).includes(removeAccents(value)));
          if (status === 'OK') {
            predictions = [...matchedAddress, ...data];
          } else {
            predictions = [...matchedAddress];
          }
          self.setState({
            predictions
          });
        });
      }, 500);
    }

    this.setState({
      [name]: value,
      authErrorMessage: ''
    });
    if (name === 'otp' && value.length === this.otp_length) {
      setTimeout(() => {
        this.login();
      }, 500);
    }
  }

  toggleCountriesList() {
    this.setState({ countriesListShow: !this.state.countriesListShow });
  }

  changeCountryCode(countryCode) {
    if (this.props.countryCode === countryCode) return;
    this.props.changeCountryCode(countryCode);
    this.setState({ countryCode });
    this.toggleCountriesList();
  }

  sendOtp() {
    const { phone, btnNextDisabled } = this.state;
    const { countryCode } = this.props;
    if (btnNextDisabled) return;
    this.setState({ btnNextDisabled: true });
    if (!phone) return;
    const params = {
      country_code: countryCode,
      phone,
      pin: false
    };
    this.startTimer();
    this.doLogin(params, '');
  }

  back() {
    this.setState(
      {
        otp: '',
        authErrorMessage: '',
        verifying: false
      },
      () => {
        this.phoneRef.focus();
      }
    );
  }

  doLogin(params, serviceFunction) {
    const { t, setAuthState, saveUserInfo } = this.props;
    var serviceFun = login;
    if (serviceFunction) {
      serviceFun = serviceFunction;
    }
    serviceFun(params)
      .then((res) => {
        //console.log('res', res);
        this.setState({ btnNextDisabled: false, otpSending: false });
        if (!res) return;
        if (!res.error) {
          if (!params.verification_code) {
            this.setState({ verifying: true }, () => {
              this.otpRef.focus();
            });
          } else {
            this.setState({ verifying: false, otp: '', phone: '' });
            saveUserInfo(res.data);
            setAuthState(true);
            this.setState({ seconds: 0 });
            clearInterval(this.timer);
            this.updateSopaBalance(res.data);
            toast.info(t('TOAST.appLogin'));
            if (this.props.isLoggedIn) {
              getOpenLoyaltyAccount(this.props.token);
            }
          }
        } else {
          this.setState({ authErrorMessage: t(`ERROR_CODE.${res.message.general.code}`) });
        }
      })
      .catch((error) => {
        this.setState({ btnNextDisabled: false, otpSending: false });
        toast.error(extractMessage(error.message));
      });
  }

  updateSopaBalance() {
    //update user's sopa points
    const { token, getWalletBalance, customer } = this.props;
    let params = { consumer_uuid: customer.customer_uuid };
    getBalance(params, token).then((res) => {
      getWalletBalance({
        balance: res.data.balance
      });
    });
  }

  login() {
    const { phone, otp } = this.state;
    const { countryCode } = this.props;
    if (!otp) return;
    // Send Otp
    const params = {
      country_code: countryCode,
      phone,
      verification_code: otp,
      pin: false
    };
    this.doLogin(params, '');
  }

  onKeyPress(event) {
    if (event.key == 'Enter') {
      this.sendOtp();
    }
  }

  onFocusAddress() {
    this.setState({
      address: '',
      showPredictions: true
    });
  }

  choosePrediction(data) {
    const { updateOrderInfo, updateCustomerPosition } = this.props;
    this.setState({
      showPredictions: false
    });
    if (data.address) {
      // Choose from customer address
      // Update order info in store
      updateOrderInfo({
        customerLat: +data.lat,
        customerLng: +data.long,
        customerAddress: data.address
      });
      this.setState({
        address: data.address,
        originAddress: data.address
      });
      // Update customer position for next order
      updateCustomerPosition({
        lat: +data.lat,
        lng: +data.long,
        address: data.address
      });
    } else {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ address: data.description }, (results, status) => {
        if (status === 'OK') {
          if (results[0]) {
            const lat = results[0].geometry.location.lat();
            const lng = results[0].geometry.location.lng();
            const address = results[0].formatted_address;
            this.setState({
              address,
              originAddress: address
            });
            // Update order info in store
            updateOrderInfo({
              customerLat: lat,
              customerLng: lng,
              customerAddress: address
            });
            // Update customer position for next order
            updateCustomerPosition({ lat, lng, address });
          } else {
            console.log('No results found');
          }
        } else {
          console.log('Geocoder failed due to: ' + status);
        }
      });
    }
  }

  checkSubmitButtonDisabled() {
    const {
      orderingMethodStatus,
      suspendStatus,
      orderPriceStatus,
      isLoggedIn,
      orderInfo,
      btnSubmitDisabled,
      orderItems,
      orderType,
      deliveryFeeErrorObject,
      customerLat,
      customerLng,
      savedDistance,
      deliveryFees,
      cityId
    } = this.props;
    const { dineInDate, guest, time } = this.props.dineIn;
    // console.log('dineInDate', dineInDate);
    //console.log('time', time);

    //console.log('savedDistance', savedDistance);

    //console.log('deliveryFees dfd', deliveryFees);

    // Check payment form
    /* if (paymentMethod === 'op'
            && (!paymentForm.card_number || !paymentForm.card_expiry_date || !paymentForm.card_cvn || Object.keys(paymentForm.error).length > 0)) {
            return true;
        } */
    // Check disallow delivery or takeaway

    if (cityId == '' && orderType === 1) {
      return true;
    }
    if (orderInfo.online_order_setting.do_dine_in == 0 && orderType === 1) {
      return true;
    }
    if (orderType === 1 && (dineInDate === '' || time === undefined || time === '-' || time === '' || guest === undefined)) {
      return true;
    }

    if (orderType === 3 && customerLat === null && customerLng === null) {
      return true;
    }

    const isMethodInvalid = orderItems.some(
      (item) =>
        (orderType === ORDER_TYPE.DELIVERY && (item.disallow_delivery || item.disallow_delivery === 1)) ||
        (orderType === ORDER_TYPE.TAKE_AWAY && (item.disallow_takeaway || item.disallow_takeaway === 1))
    );
    if (isMethodInvalid) return true;

    //if (orderInfo.order_type === ORDER_TYPE.DELIVERY && deliveryFees>0) return false; //if Lala Move Delivery

    //if (orderInfo.order_type === ORDER_TYPE.DELIVERY && deliveryFeeErrorObject && deliveryFeeErrorObject.code !== 2) return true;
    if (orderInfo.online_order_setting.delivery_partner != 'internal' && orderInfo.order_type === ORDER_TYPE.DELIVERY && deliveryFees.totalFee == 0) return true;
    //console.log('deliveryFeeErrorObject', deliveryFeeErrorObject);
    if (!this.checkDeliveryRange()) return true;

    //const onlineOrderSetting = orderInfo.online_order_setting;
    return (
      !isLoggedIn ||
      btnSubmitDisabled ||
      !orderingMethodStatus ||
      !suspendStatus ||
      orderPriceStatus !== 3 ||
      //(orderInfo.order_type === ORDER_TYPE.DELIVERY && onlineOrderSetting.delivery_distance && savedDistance > onlineOrderSetting.delivery_distance) ||
      (orderInfo.order_type === ORDER_TYPE.DELIVERY && (!orderInfo.customerAddress || !orderInfo.customerLat || !orderInfo.customerLng))
    );
  }

  createOrder() {
    const { t, recurringOrder, paymentMethod, orderType, orderInfo, customer } = this.props;
    const { dineInDate, guest, time } = this.props.dineIn;
    const setting_checkout_time = orderInfo.online_order_setting.dine_in_checkout_time;

    if (customer != undefined && (customer.phone == '' || customer.name === undefined || customer.name === null || customer.email === undefined || customer.email === null)) {
      toast.info(t('TOAST.completeYourProfile'));
      history.push('/customer/account/profile/edit');
    } else {

      if (recurringOrder.is_recurring != undefined && orderType == 3) {
        if (recurringOrder.is_recurring && (paymentMethod === 'vtc' || paymentMethod === 'VNPTPAY')) {
          //VTC pay is not allow in recurring orders
          this.setState({ message: t('TOAST.VTC_NOT_ALLOWED_IN_RECURRING_ORDER') });
          this.modalPopup.toggleModal();
          // toast.info(t('TOAST.VTC_NOT_ALLOWED_IN_RECURRING_ORDER'));
          return;
        }
      }
      if (orderType == 1 && dineInDate != '' && time != '') {
        var today = moment(dineInDate).isSame(new Date(), 'day');
        let currentTime = moment().add(setting_checkout_time, 'minutes').format('HH:mm');

        if (today && !moment(time, 'HH:mm').isSameOrAfter(moment(currentTime, 'HH:mm'))) {
          this.setState({ message: formatString(t('TOAST.DINE_IN_MAX_TIME_ERROR'), setting_checkout_time) });
          this.modalPopup.toggleModal();
          return;
        }

        if (moment(dineInDate + ' ' + time).isBefore(moment().format('ddd, DD MMM YYYY HH:mm'))) {
          this.setState({ message: t('TOAST.DINE_IN_PAST_DATE_ERROR') });
          this.modalPopup.toggleModal();
          return;
        }

        if (dineInDate == '') {
          this.setState({ message: t('TOAST.SELECT_DINE_IN_DATE') });
          this.modalPopup.toggleModal();
          return;
        }
        if (time == '' || time == '-') {
          this.setState({ message: t('TOAST.PLEASE_SELECT_TIME') });
          this.modalPopup.toggleModal();
          return;
        }
        if (guest == '-' || guest == '') {
          this.setState({ message: t('TOAST.SELECT_DINE_IN_GUEST') });
          this.modalPopup.toggleModal();
          return;
        }
      }

      if (this.checkSubmitButtonDisabled()) return;
      this.setState({ addressToggleCheckout: 'hide-address' });
      this.props.onCreateOrder();
    }
  }

  toggleMapMobile() {
    this.setState({ mapMobileOpened: !this.state.mapMobileOpened });
  }

  onChangePaymentMethod(event) {
    const { paymentMethod, changePaymentMethod } = this.props;
    const value = event.target.value;
    if (paymentMethod === value) return;
    changePaymentMethod(value);
  }

  checkDeliveryRange = () => {
    const { customerLat, customerLng, orderInfo, deliveryFeeObject, savedDistance, deliveryFees } = this.props;
    const onlineOrderSetting = orderInfo.online_order_setting;
    //console.log('onlineOrderSetting', onlineOrderSetting);

    if (customerLat && customerLng && orderInfo.order_type === ORDER_TYPE.DELIVERY && (onlineOrderSetting.delivery_distance == 0 || onlineOrderSetting.delivery_distance == null || savedDistance <= onlineOrderSetting.delivery_distance)) {
      // if lalamove providing delivery
      return true;
    }
    /*
    if (customerLat && customerLng && orderInfo.order_type === ORDER_TYPE.DELIVERY && deliveryFees.totalFee == 0) {
      // if lalamove providing delivery
      return false;
    } */
    //console.log('onlineOrderSetting.delivery_distance', onlineOrderSetting.delivery_distance);
    //console.log('savedDistance', savedDistance);
    if (
      customerLat &&
      customerLng &&
      orderInfo.order_type === ORDER_TYPE.DELIVERY &&
      onlineOrderSetting.delivery_distance
      //&& savedDistance > onlineOrderSetting.delivery_distance
    ) {
      return false;
    }
    const hasDeliveryFeeSetting = onlineOrderSetting.delivery_fee_setting ? onlineOrderSetting.delivery_fee_setting.some((obj) => obj.status === 1) : false;
    if (customerLat && customerLng && orderInfo.order_type === ORDER_TYPE.DELIVERY && hasDeliveryFeeSetting && !deliveryFeeObject) return false;
    return true;
  };

  toggleAddressState(opt) {
    this.setState({ addressToggle: opt });
  }

  handleSocialLogin = (user) => {
    //console.log('user', user);
    const params = {
      name: user._profile.name,
      email: user._profile.email,
      app_id: user._profile.id,
      type: user._provider,
      photo: user._profile.profilePicURL,
      verification_code: 'xxx' //for bypass in doLogin function
    }
    // console.log('params', params);
    this.doLogin(params, socialLogin);
  }

  handleSocialLoginFailure = (err) => {
    const { t } = this.props;

    //toast.error(t('TOAST.appSignupFail'));
    //console.error('login error', err);
  }

 /*  getDiscountText(type, discountData) {
    let text = '';
    if(discountData.length>0){
      const type_settings = discountData[0].type_settings;
      const paymentSetting = type_settings.filter(setting => {
         return setting.payment_method === type && setting.discount_value != 0
      });
      if (paymentSetting.length>0) {
          text = paymentSetting[0].value_type === 'percent' ? 'Save - ' + paymentSetting[0].discount_value + '% off' : 'Save - ' + paymentSetting[0].discount_value + ' off'
      }
    }
    return text;
} */

getDiscountText(method){
  const {orderInfo, orderType, dineIn} = this.props;


  const discount_setting = orderInfo.discount_setting;
  let text = '';
  const discount_type = discount_setting.length>0 && discount_setting[0].discount_type;
  if ((discount_setting!=undefined && discount_setting.length>0 && discount_type==='payment')){
    const paymentSetting = [];
    discount_setting.map(setting =>{
      let format = 'YYYY-MM-DD HH:mm:ss';
      if(isDiscountExpire(setting.start_time, setting.end_time, format, orderType, dineIn, discount_type, method)){
        setting.type_settings.map(type_setting=>{
          if(type_setting.payment_method == method && type_setting.discount_value!=0){
            paymentSetting.push(type_setting);
            return type_setting;
          }
        });
      }
    })
    if(paymentSetting.length>0){
      text = paymentSetting[0].value_type === 'percent' ? 'Save - ' + paymentSetting[0].discount_value + '% off' : 'Save - ' + paymentSetting[0].discount_value + ' off'
      return text;
    }else{
      return false;
    }
  }
}
render() {
    const {
      t,
      lang,
      orderInfo,
      isLoggedIn,
      customer,
      totalPrice,
      orderType,
      distance,
      deliveryFee,
      deliveryFeeErrorObject,
      paymentMethod,
      waitForPay,
      balance,
      redeem,
      filters,
      cityId,
      orderVouchers
    } = this.props;
    const {
      phone,
      otp,
      verifying,
      countriesListShow,
      btnNextDisabled,
      authErrorMessage,
      resendSeconds,
      search_country,
      addressToggle,
      addressToggleCheckout,
      message,
      orderNote
    } = this.state;
    const { countryCode } = this.props;
    var countryCodeUpdated = countryCode;
    /* const countryDetail = cityId != '' && filters.locations.length>0 && filters.locations.filter(location=>{
      return location.cities.length>0 && location.cities.find(city=> {
        return (city.city_uuid === cityId)
      })
    });

    if(countryDetail != undefined && countryDetail.length> 0) {
      countryCodeUpdated = countryDetail[0].short_name;
    }
    console.log('paymentMethod', paymentMethod); */
    //console.log('paymentMethod', paymentMethod);
    const selectedCountry = countries.find((country) => country.country_code === countryCodeUpdated);

    let customerSelectedCountry = isLoggedIn && countries.find((country) => country.country_code === customer.country_code);
    //console.log('deliveryFee', deliveryFee);
    //console.log('discountSettings', orderInfo);
    const discount_Settings = orderInfo.discount_setting;

    const currencySymbol = orderInfo.currency.symbol;
    // Submit button disabled state
    // Restaurant info
    //const restaurantTranslation = orderInfo.translations ? orderInfo.translations.find((obj) => obj.lang_iso_code === lang) : null;
    //const restaurantName = (restaurantTranslation && restaurantTranslation.name) || orderInfo.name || '';

    const isBtnDisabled = this.checkSubmitButtonDisabled();

    return (
      <>
        <div className="checkout-info">
          {waitForPay && <LoadingIcon />}

          {/* /*when user is not loggedin*/}
          {!isLoggedIn && (
            <div className="not-logged">
              <div className="user-detail">
                <div className="number active">
                  <span>1</span>
                </div>
                <div className="phoneLogin">
                  {!verifying && <label>{t('LABEL.CART_PHONE')}</label>}
                  {verifying && (
                    <label className="phone-verifying">
                      <i className="icon-hottab-arrow-left" onClick={() => this.back()}></i>
                      {t('LABEL.VERIFY_PHONE_NUMBER')}
                    </label>
                  )}

                  <div className="input-wrapper">
                    <div className="non-verify-phone">
                      <div className="countries-data">
                        {selectedCountry != undefined && <div className="countries-toggle" onClick={() => this.toggleCountriesList()}>
                          <ReactCountryFlag code={selectedCountry.alpha2} svg />+ {selectedCountry != undefined && selectedCountry.country_code}
                          <i className={`icon-hottab-angle-${countriesListShow ? 'up' : 'down'}`}></i>
                        </div>}
                        {countriesListShow && (
                          <div className="countries-wrapper" ref={(node) => (this.countriesRef = node)}>
                            <div className="country-search cleafix">
                              <input type="text" name="search_country" placeholder="Type to search..." value={search_country} onChange={this.handleInputChangeSearch} />
                              <button type="button">
                                <i className="material-icons">search</i>
                              </button>
                            </div>
                            <div className="searchlist">
                              {countries
                                .filter((country) => {
                                  if (search_country) {
                                    const countryName = country.name.toLowerCase();
                                    return countryName.startsWith(search_country.toLowerCase());
                                  } else {
                                    return country.name != '';
                                  }
                                })
                                .map((country, i) => {
                                  const isSelected = country.country_code === countryCodeUpdated;
                                  return (
                                    <div className={`country cleafix ${isSelected ? 'selected' : ''}`} onClick={() => this.changeCountryCode(country.country_code)} key={i}>
                                      {country.alpha2 && <ReactCountryFlag code={country.alpha2} svg />}
                                      <div className="country-name">{country.name}</div>
                                      <div className="country-code">+ {country.country_code}</div>
                                    </div>
                                  );
                                })}
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="input-button">
                        <div className="input-text">
                          <div className="input">
                            <input
                              ref={(node) => (this.phoneRef = node)}
                              type="text"
                              name="phone"
                              placeholder={t('PLACEHOLDER.PHONE')}
                              value={phone}
                              onKeyPress={this.onKeyPress}
                              onChange={(e) => this.handleInputChange(e, true)}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="login-btn">
                        {!verifying && (
                          <button className={`btn btn-type-2 ${phone.length > 0 ? 'visible' : ''} ${btnNextDisabled ? 'disabled' : ''}`} onClick={() => this.sendOtp()}>
                            {/* {t('BUTTON.NEXT')} */}
                            <i className="icon-hottab-arrow-right"></i>
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="input-button">
                      <div className="verify-otp-wrapper">
                        {verifying && <p className="otp-label">{t('LABEL.OTP_SEND_MESSAGE')}</p>}
                        {verifying && (
                          <p className="otpexpire">
                            {t('LABEL.OTP_EXPIRE_IN')} <span>{`${this.state.time.m} : ${this.state.time.s}`}</span>
                          </p>
                        )}
                        {verifying && (
                          <input
                            ref={(node) => (this.otpRef = node)}
                            type="text"
                            className="input-otp"
                            name="otp"
                            placeholder={t('LABEL.CODE_OTP')}
                            value={otp}
                            onChange={(e) => this.handleInputChange(e, true)}
                          />
                        )}
                        {verifying && (
                          <div className="resend-otp" onClick={() => this.resendOtp()}>
                            {t('BUTTON.RESEND_OTP')} {resendSeconds > 0 ? `(${resendSeconds})` : ''}
                          </div>
                        )}
                        {verifying && (
                          <div className="resend-otp cancel" onClick={() => this.back()}>
                            {t('BUTTON.CANCEL')}
                          </div>
                        )}
                        {/* <div className="login-btn">
                                                {verifying && <button
                                                    className={`btn btn-type-2 btn-verify ${btnVerifyDisabled ? 'disabled' : ''}`}
                                                    onClick={() => this.login()}>
                                                     {t('BUTTON.SEND_OTP')}
                                                    <i className="icon-hottab-arrow-right"></i>
                                                </button>}
                                            </div> */}
                      </div>
                    </div>
                  </div>
                  {authErrorMessage && <div className="auth-error-message">{authErrorMessage}</div>}


                  {!verifying && <div className="socialLogin">
                    <div className="socialLoginOR"><span><hr /></span><span className="or">OR</span><span><hr /></span></div>
                    <SocialButton
                      provider='facebook'
                      appId={FACEBOOK_APP_ID_NEW}
                      onLoginSuccess={this.handleSocialLogin}
                      onLoginFailure={this.handleSocialLoginFailure}
                      className="facebookBtn"
                    >
                      {<img className="icon-hottab-facebook" src="images/svg/facebook-icon.svg" />} {t('LABEL.FACEBOOK_SOCIAL_LOGIN')}
                    </SocialButton>
                    <SocialButton
                      provider='google'
                      appId={GOOGLE_CLIENT_ID_NEW}
                      onLoginSuccess={this.handleSocialLogin}
                      onLoginFailure={this.handleSocialLoginFailure}
                      className="googleBtn"
                    >
                      <img className="icon-hottab-facebook" src="images/svg/google-icon.svg" />{t('LABEL.GOOGLE_SOCIAL_LOGIN')}
                    </SocialButton>
                  </div>}
                </div>
              </div>
              <div className="grey-block">
                {orderType == 3 && (
                  <div className="address">
                    <div className="number">
                      <span>2</span>
                    </div>
                    <div className="gray">{t('LABEL.DELIVERY_ADDRESS')}</div>
                  </div>
                )}
                {orderType == 1 && (
                  <div className="address">
                    <div className="number">
                      <span>2</span>
                    </div>
                    <div className="gray">{t('LABEL.DINE_IN_DETAIL')}</div>
                  </div>
                )}
                <div className="paymentMethod">
                  <div className="number">
                    <span>{orderType == 2 ? 2 : 3}</span>
                  </div>{' '}
                  <div className="gray">{t('LABEL.PAYMENT_METHOD')}</div>
                </div>
              </div>
            </div>
          )}
          {/* /*when user loggedin*/}
          {isLoggedIn && (
            <div className="logged">
              <div className="user-detail">
                <div className="number">
                  <span>1</span>
                </div>
                <div className="user-info">
                  {<label>{t('PLACEHOLDER.PHONE')}</label>}
                  <div className="input-wrapper">
                    <div className="countries-data">
                      <div className="countries-toggle">
                        {customerSelectedCountry != undefined && <ReactCountryFlag code={customerSelectedCountry.alpha2} svg />}+ {customerSelectedCountry != undefined && customerSelectedCountry.country_code}
                        <i className={`icon-hottab-angle-${countriesListShow ? 'up' : 'down'}`}></i>
                      </div>
                    </div>
                    <div className="input-button">
                      <div className="input-text">
                        <div className="input">
                          <input
                            ref={(node) => (this.phoneRef = node)}
                            type="text"
                            disabled={true}
                            name="phone"
                            placeholder={t('PLACEHOLDER.PHONE')}
                            value={customer.phone}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* {customer.phone && <div className="phone">
                                    +{customer.country_code} {customer.phone}
                                </div>}
                                {customer.name && <div className="name">{customer.name}</div>} */}
                </div>
              </div>

              {(orderType == 1 || orderType == 3) && (
                <div className="dinein-address">
                  <DineIn isBtnDisabled={isBtnDisabled} addressToggleCheckout={addressToggleCheckout} addressToggle={addressToggle} />
                  <CheckoutAddress
                    orderInfo={orderInfo}
                    distance={distance}
                    isBtnDisabled={isBtnDisabled}
                    deliveryFeeObject={this.props.deliveryFeeObject}
                    deliveryFeeErrorObject={deliveryFeeErrorObject}
                    deliveryFee={deliveryFee}
                    addressToggleCheckout={addressToggleCheckout}
                    toggleAddressState={this.toggleAddressState}
                    checkRedeem={this.checkRedeem}
                    checkDeliveryRange={this.checkDeliveryRange}
                    orderVouchers = {orderVouchers}
                    //getLocalDeliveryCalculation = {deliveryFee}
                  />
                </div>
              )}
            {console.log('addressToggle', addressToggle)}
              <div className="payment-wrapper-outer">
                {orderType == 3 || orderType == 2 || orderType == 1 ? (
                  <div className={`number  ${addressToggle == 'show' ? '' : !isBtnDisabled || addressToggleCheckout ? 'active' : ''}`}>
                    <span>{orderType == 1 ? 3 : orderType}</span>
                  </div>
                ) : (
                    <div className="number">
                      <span>{orderType == 1 ? 3 : orderType}</span>
                    </div>
                  )}

                <div className="payment">
                  <label>{t('LABEL.PAYMENT_METHOD')}</label>
                  <div
                    className={`payment-wrapper ${addressToggle == 'hide' ? '' : orderType == 2 || orderType == 1 ? '' : isBtnDisabled ? 'hide-payment' : ''} ${addressToggleCheckout ? 'show' : !isBtnDisabled ? '' : 'd-none'
                      }`}
                  >
                    <div className={`payment-method `}>
                      <label className="styled-radio">
                        <input type="radio" value="cod" disabled={waitForPay ? true : false} checked={paymentMethod === 'cod'} onChange={this.onChangePaymentMethod} />
                        <span className="checkmark"></span>
                        <span className="payment-text">{orderType == 1 || orderType == 2 ? t('LABEL.COA') : t('LABEL.COD')}</span>
                        {this.getDiscountText('cod') && <span className="offertext"><img src="images/svg/promo-red.svg" /> {this.getDiscountText('cod')}</span>}
                      </label>
                    </div>
                    <div className={`payment-method `}>
                      <label className="styled-radio">
                        <input type="radio" value="vtc" disabled={waitForPay ? true : false} checked={paymentMethod === 'vtc'} onChange={this.onChangePaymentMethod} />

                        <span className="checkmark"></span>
                        <span className="payment-text">{t('LABEL.VTCPAY')}</span>
                        {this.getDiscountText('vtc') && <span className="offertext"><img src="images/svg/promo-red.svg" />{this.getDiscountText('vtc')}</span>}
                      </label>
                    </div>
                    <div className={`payment-method `}>
                      <label className="styled-radio">
                        <input type="radio" value="VNPTPAY" disabled={waitForPay ? true : false} checked={paymentMethod === 'VNPTPAY'} onChange={this.onChangePaymentMethod} />

                        <span className="checkmark"></span>
                        <span className="payment-text">{t('LABEL.VNPTPAY')}</span>
                        {this.getDiscountText('vnptpay') && <span className="offertext"><img src="images/svg/promo-red.svg" />{this.getDiscountText('vnptpay')}</span>}
                      </label>
                    </div>
                    <div className={`payment-method `}>
                      <label className="styled-radio">
                        <input type="radio" value="momo" disabled={waitForPay ? true : false} checked={paymentMethod === 'momo'} onChange={this.onChangePaymentMethod} />

                        <span className="checkmark"></span>
                        <span className="payment-text">{t('LABEL.MOMO')}</span>
                        {this.getDiscountText('momo') && <span className="offertext"><img src="images/svg/promo-red.svg" />{this.getDiscountText('momo')}</span>}
                      </label>
                    </div>
                    <div className={`payment-method `}>
                      <label className="styled-radio">
                        <input type="radio" value="zalo" disabled={waitForPay ? true : false} checked={paymentMethod === 'zalo'} onChange={this.onChangePaymentMethod} />

                        <span className="checkmark"></span>
                        <span className="payment-text">{t('LABEL.ZALO')}</span>
                        {this.getDiscountText('zalo') && <span className="offertext"><img src="images/svg/promo-red.svg" />{this.getDiscountText('zalo')}</span>}
                      </label>
                    </div>
                    {/* <div className={`payment-method  ${redeem.points > balance ? 'inactive' : ''}`}>
                      <label className="styled-radio">
                        <input
                          type="radio"
                          value="sopapoints"
                          disabled={redeem.points >= balance || waitForPay == true ? true : false}
                          checked={paymentMethod === 'sopapoints'}
                          onChange={this.onChangePaymentMethod}
                        />
                        <span className="checkmark"></span>
                        <span className="payment-text">
                          {t('LABEL.LOYALTY')}
                          <span className="available-balance">
                            ({t('LABEL.AVAILALBE_BALANCE')} {balance})
                          </span>
                        </span>
                      </label>
                    </div> */}
                  </div>
                </div>
              </div>
              {/* <PaymentForm isOpen={paymentMethod === 'op'} updatePaymentForm={updatePaymentForm} /> */}
            </div>
          )}
          <Popup onItemRef={(ref) => (this.modalPopup = ref)} className="popup-confirm modal-confirm" message={message} onConfirm={this.handleConfirm} />
        </div>
        {/* <div className="disclaimer">
          <p>{formatString(t('LABEL.CART_NO_DELIVERY'), restaurantName)}</p>
        </div> */}
        <div className="merchant_note">
          <div className="note_text">
            <span>{t('LABEL.MERCHANT_NOTE')}</span>
            <span className="merchantnoteText">{t('LABEL.MERCAHNT_NOTE_TEXT')}</span>
          </div>
          <TextareaAutosize
            className="order-note"
            name="orderNote"
            placeholder={t('LABEL.ORDER_NOTE')}
            value={orderNote}
            minRows={3}
            maxRows={10}
            onChange={this.handleInputChange}
          />
        </div>
        {isLoggedIn && (
          <button disabled={isBtnDisabled} className={`btn btn-type-2 btn-place-order`} onClick={() => this.createOrder()}>
            {t('BUTTON.PLACE_ORDER')} ·{' '}
            {paymentMethod === 'sopapoints' && redeem.points <= balance ? (
              <span>
                {totalPrice} {t('LABEL.LOYALTY')}
              </span>
            ) : (
                getCurrency(totalPrice, currencySymbol)
              )}
          </button>
        )}
      </>
    );
  }
}

export default CheckoutInfo;
