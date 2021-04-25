/*global google*/
import React from 'react';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
//import { DistanceMatrixService } from 'react-google-maps';
import { toast } from 'react-toastify';
import { roundTo, getCurrency, extractMessage, fragmentGoogleAddress, parseAddress } from 'utils';
import { DISTANCE_UNIT } from 'constants/common';
import LoadingIcon from 'components/LoadingIcon';
import { addCustomerAddress, updateCustomerAddress } from 'services/customer';
import { getDeliveryFeeQuotation } from 'services/order';
import { setAuthState, saveUserInfo } from 'store/actions/auth';
import { updateOrderInfo, saveDeliveryFees } from 'store/actions/order';
import { updateCustomerPosition, changePaymentMethod, changeDistance } from 'store/actions/config';
import AutoCompleteAddress from 'containers/Account/components/AutocompleteAddress';
import { replaceAddress } from 'store/actions/auth';

@withTranslation('translations')
@connect(
  (state) => ({
    token: state.auth.token,
    lang: state.config.lang,
    position: state.config.position,
    savedDistance: state.config.savedDistance,
    isLoggedIn: state.auth.loggedIn,
    orderInfo: state.order.info,
    orderItems: state.order.items,
    customer: state.auth.customer,
    orderType: state.config.order_type,
    address: state.auth.address,
    customerLat: state.config.customerLat,
    customerLng: state.config.customerLng,
    customerAddress: state.auth.address,
    paymentMethod: state.config.paymentMethod,
    deliveryFees: state.order.deliveryFees,
    filters: state.restaurant.filters,
    selectedFilters: state.restaurant.selectedFilters,
    cityId: state.config.cityId
  }),
  {
    setAuthState,
    saveUserInfo,
    updateOrderInfo,
    updateCustomerPosition,
    changePaymentMethod,
    replaceAddress,
    changeDistance,
    saveDeliveryFees
  }
)
class CheckoutAddress extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      btnNextDisabled: false,
      btnVerifyDisabled: false,
      authErrorMessage: '',
      address: '',
      originAddress: '',
      addressNote: '',
      showPredictions: false,
      predictions: props.address || [],
      originPredictions: props.address || [],
      localty: '',
      areaNstreet: '',
      city: '',
      state: '',
      country: '',
      landmark: '',
      name: 'work',
      name_other_tag: '',
      lat: '',
      lng: '',
      address_json: {},
      error: {},
      style: '',
      customer_address_uuid: '',
      customerLatitude: null,
      customerLongitude: null,
      addressToggle: '',
      checkPageLoaded: true,
      isFormValid: false,
      checkDeliveryRange: true,
      radiAddressSelected: ''
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);

    this.onFocusAddress = this.onFocusAddress.bind(this);
    this.getCurrentAddress = this.getCurrentAddress.bind(this);
    this.addAddress = this.addAddress.bind(this);
    this.showAddress = this.showAddress.bind(this);
    this.hideAddress = this.hideAddress.bind(this);
    this.populateAddress = this.populateAddress.bind(this);
    this.toggleAddress = this.toggleAddress.bind(this);
    this.chooseAddress = this.chooseAddress.bind(this);
    this.onBlurAddress = this.onBlurAddress.bind(this);
    this.validateForm = this.validateForm.bind(this);
    this.formValid = this.formValid.bind(this);
    this.checkDeliveryRange = this.checkDeliveryRange.bind(this);
  }
  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
    const { updateCustomerPosition } = this.props;
    const { customerLatitude, customerLongitude, address } = this.state;
    updateCustomerPosition({ lat: customerLatitude, lng: customerLongitude, address: address });
    //this.getCurrentAddress();
  }

  componentDidUpdate(prevProps, prevState) {
    const { checkDeliveryRange } = this.state;
    if (prevState.checkDeliveryRange != checkDeliveryRange) {
      // this.setState({ checkDeliveryRange: this.props.checkDeliveryRange() });
    }

    if (prevProps.position !== this.props.position) {
      //  this.getCurrentAddress();
    }
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  resetState() {
    this.setState({
      localty: '',
      areaNstreet: '',
      city: '',
      state: '',
      country: '',
      name: 'work',
      landmark: '',
      customer_address_uuid: '',
      name_other_tag: '',
      originAddress: '',
      lat: null,
      lng: null
    });
  }

  getCurrentAddress() {
    const { t, updateOrderInfo, updateCustomerPosition } = this.props;
    const { error } = this.state;
    this.resetState();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((data) => {
        const latLng = {
          lat: data.coords.latitude,
          lng: data.coords.longitude
        };
        const lat = data.coords.latitude;
        const lng = data.coords.longitude;
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ location: latLng }, (results, status) => {
          if (status === 'OK') {
            if (results[0]) {
              const address = results[0].formatted_address;
              const address_json = fragmentGoogleAddress(results[0]);
              this.setState({
                address,
                originAddress: address,
                areaNstreet: address,
                city: address_json.city,
                state: address_json.state,
                country: address_json.country,
                lat,
                lng,
                address_json
              });
              /* if (!address_json.localty) {
                error.localty = t('VALIDATE.ENTER_LOCALTY');
              } else {
                delete error.localty;
              } */
              if (!address_json.areaNstreet) {
                error.areaNstreet = t('VALIDATE.ENTER_AREA_AND_STREET');
              } else {
                delete error.areaNstreet;
              }

              if (Object.keys(error).length > 0) {
                this.setState({ addressToggle: 'show', error });
                return;
              }

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
      });
    }
  }

  addAddress() {
    const {token, customer, customerAddress, replaceAddress, updateOrderInfo, updateCustomerPosition, orderInfo } = this.props;
    const { name, lat, lng, localty, areaNstreet, city, state, country, landmark, customer_address_uuid, name_other_tag } = this.state;

    var addressJSON = { localty: localty, areaNstreet: areaNstreet, city: city, state: state, country: country, landmark: landmark };
    if (name == 'other') {
      addressJSON.address_type_other = name_other_tag;
    }

    if (this.validateForm()) {
      var newAddress = areaNstreet;
      if(localty != ''){
        newAddress = localty + ', ' + areaNstreet;
      }

      this.getDeliveryFeeQuotation(newAddress, lat, lng, orderInfo.online_order_setting.delivery_partner);
      this.calculateDistance(lat, lng);
      const params = {
        customer_uuid: customer.customer_uuid,
        name,
        address: newAddress,
        address_json: addressJSON,
        lat,
        long: lng
      };

      if (customer_address_uuid) {
        const paramsUpdate = {
          cus_address_uuid: customer_address_uuid,
          name,
          address: newAddress,
          address_json: addressJSON,
          lat,
          long: lng
        };
        for (let i = 0; i < customerAddress.length; i++) {
          if (customerAddress[i].cus_address_uuid === customer_address_uuid) {
            customerAddress[i] = paramsUpdate;
            break;
          }
        }
        // console.log('paramsUpdate', newcustArr);
        updateCustomerAddress(paramsUpdate, token).then((res) => {
          if (res && !res.error) {
            //console
            //toast.info(t('TOAST.UpdateAddressSuccessfully'));
            const address = {
              cus_address_uuid: res.data.cus_address_uuid,
              customer_uuid: customer.customer_uuid,
              name,
              address: newAddress,
              address_json: addressJSON,
              lat,
              long: lng
            };
            if (this.formValid()) {
              this.setState({ isFormValid: true, addressToggle: 'hide' });
              this.toggleAddress('hide');
            } else {
              this.setState({ isFormValid: false, addressToggle: 'show' });
              this.toggleAddress('show');
            }

            this.setState({ customer_address_uuid: res.data.cus_address_uuid, isFormValid: true });
            updateOrderInfo({
              customerLat: lat,
              customerLng: lng,
              customerAddress: newAddress
            });
            // Update customer position for next order
            updateCustomerPosition({ lat, lng, newAddress });

            // addAddress(newAddress);
            replaceAddress(customerAddress);
          } else {
            //reject(res);
          }
        });
      } else {
        addCustomerAddress(params, token)
          .then((res) => {
            if (res && !res.error) {
              // toast.info(t('TOAST.AddAddressSuccessfully'));
              const newReplaceAddress = [
                ...customerAddress,
                {
                  cus_address_uuid: res.data.cus_address_uuid,
                  customer_uuid: customer.customer_uuid,
                  name,
                  address: newAddress,
                  address_json: addressJSON,
                  lat,
                  long: lng
                }
              ];
              const address = {
                cus_address_uuid: res.data.cus_address_uuid,
                customer_uuid: customer.customer_uuid,
                name,
                address: newAddress,
                address_json: addressJSON,
                lat,
                long: lng
              };
              if (this.formValid()) {
                this.setState({ isFormValid: true, addressToggle: 'hide' });
                this.toggleAddress('hide');
              } else {
                this.setState({ isFormValid: false, addressToggle: 'show' });
                this.toggleAddress('show');
              }
              this.setState({ customer_address_uuid: res.data.cus_address_uuid });
              //addAddress(newAddress);
              updateOrderInfo({
                customerLat: lat,
                customerLng: lng,
                customerAddress: newAddress
              });
              // Update customer position for next order
              updateCustomerPosition({ lat, lng, address });
              replaceAddress(newReplaceAddress);
            }
          })
          .catch((err) => {
            toast.error(extractMessage(err.message));
          });
      }
    }
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

  handleInputChange(event, isNumber) {
    const { updateOrderInfo } = this.props;
    const { error } = this.state;
    const target = event.target;
    const value = target.value;
    const name = target.name;
    //console.log('error.name', name);

    if (name != '') {
      // console.log('error', error);

      delete error.name;
      //console.log('error', error);
      this.setState({ error: {} });
    }

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

    // Address autocomplete
    /* if (name === 'address') {

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
                const location = `${orderInfo.lat},${orderInfo.long}`
                const options = {
                    input: value,
                    location,
                    bounds,
                    componentRestrictions: { country: "vn" }
                };
                autocompleteService.getPlacePredictions(options, (data, status) => {
                    let predictions = [];
                    const matchedAddress = address.filter(item => removeAccents(item.address.toLowerCase()).includes(removeAccents(value)));
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
 */
    this.setState({
      [name]: value,
      authErrorMessage: ''
    });
  }

  onFocusAddress() {
    this.setState({
      /*  areaNstreet: '', */
      showPredictions: true
    });
  }

  onBlurAddress() {
    const { t } = this.props;
    const { areaNstreet, lat, lng } = this.state;
    const error = {};
    // console.log(lat, lng, areaNstreet);
    if (!areaNstreet) {
      error.areaNstreet = t('VALIDATE.CART_SELECT_ADDRESS_FROM_SUGGESTION');
    } else {
      delete error.areaNstreet;
    }
    if (Object.keys(error).length > 0) {
      this.setState({ error });
      return;
    }
  }

  chooseAddress(data, place) {
    //  console.log('place', place);
    const { updateOrderInfo, updateCustomerPosition } = this.props;
    /*  console.log('====================================');
    console.log('place', place);
    console.log('===================================='); */
    const address_json = fragmentGoogleAddress(place);
    var lat = roundTo(place.geometry.location.lat(), 7);
    var lng = roundTo(place.geometry.location.lng(), 7);

    this.setState({
      areaNstreet: address_json.formatted_address,
      originareaNstreet: address_json.formatted_address,
      city: address_json.city,
      state: address_json.state,
      country: address_json.country,
      lat,
      lng
    });
    if (this.validateForm()) {
      var newAddress = address_json.formatted_address;
      updateOrderInfo({
        customerLat: lat,
        customerLng: lng,
        customerAddress: newAddress
      });
      // Update customer position for next order
      updateCustomerPosition({ lat, lng, newAddress });
    }
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

  checkDeliveryRange() {
    console.log('====================================');
    console.log('ghjgjhggjhgh');
    console.log('====================================');
    this.setState({
      checkDeliveryRange: this.props.checkDeliveryRange()
    });
    //return this.props.checkDeliveryRange();
  }

  showAddress() {
    this.setState({ style: 'block' });
  }
  hideAddress() {
    this.setState({ style: '' });
  }
  distanceCallback = (response) => {
    //console.log("Hello");
    console.log(response);

    if (response !== null) {
      if (response.status === "OK") {
        this.setState(() => ({
          response,
        }));
      } else {
        console.log("response: ", response);
      }
    }
  }
  calculateDistance(customerLat, customerLng) {
    const { orderInfo, changeDistance } = this.props;
    if (customerLat && customerLng) {
      const DirectionsService = new google.maps.DirectionsService();
        DirectionsService.route(
          {
            origin: new google.maps.LatLng(orderInfo.lat, orderInfo.long),
            destination: new google.maps.LatLng(customerLat, customerLng),
            travelMode: google.maps.TravelMode.DRIVING
          },
          (result, status) => {
            if (status === google.maps.DirectionsStatus.OK) {
              changeDistance(roundTo(result.routes[0].legs[0].distance.value/1000, 1));
            } else {
              changeDistance('');
              console.error(`error fetching directions ${result}`);
            }
          }
        );
    }
  }

  async getDeliveryFeeQuotation(customerAddress, customerLat, customerLng, deliveryProvider) {
    const { orderInfo, customer, cityId } = this.props;
    let deliveryCustomerCountry = '';
    //const deliveryCustomerName = customer.name ? customer.name : customer.phone;
    const deliveryCustomerLat = customerLat;
    const deliveryCustomerLong = customerLng;
    const deliveryCustomerAddress = customerAddress;


    //const deliveryCustomerPhone = customer.phone;
    if (cityId == '9915b780-fc36-11e8-8727-5b026453a69e') {
      deliveryCustomerCountry = 'IN_DEL';
    } else if (cityId == '3f236e20-04c5-11e8-8586-b3151add17a4') {
      deliveryCustomerCountry = 'VN_HAN';
    } else if (cityId == '0df85a00-0fd0-11e8-87f6-05eed39ce904') {
      deliveryCustomerCountry = 'VN_SGN';
    } else {
      deliveryCustomerCountry = '';
    }
    const deliveryRestaurantCountry = deliveryCustomerCountry;
    var params = {};

      let orderItems = [];
      this.props.orderItems.map(item=> {
          let itemObj = {item_uuid: item.item_uuid, item_quantity: item.quantity, item_options: item.item_options};
          orderItems.push(itemObj);
      });
      params.lang = 'en';
      params.items = orderItems;
      params.order_type = 3;
      params.customer = {
        customer_uuid : customer.customer_uuid,
        customer_address: deliveryCustomerAddress,
        customer_lat: deliveryCustomerLat,
        customer_long: deliveryCustomerLong
      };
      params.vouchers = [...this.props.orderVouchers];
      //params.delivery_amount =

      if(deliveryProvider === 'lalamove'){
        params.delivery_provider = 'lalamove';
      }

      if(deliveryProvider === 'internal'){
        params.delivery_provider = 'internal';
      }
    //  if(deliveryProvider != 'internal') {
        this.setState({checkDeliveryRange: false});
     // }

      this.props.saveDeliveryFees({ totalFee: 0, totalFeeCurrency: 'VND', loading: true, country: deliveryRestaurantCountry });
      await getDeliveryFeeQuotation(params)
        .then((res) => {
          if (res && !res.error) {
            //console.log('res', res.data.totalFee);
            if(res.data.totalFee >= 0) {
              this.setState({checkDeliveryRange: true});
            }
            this.props.saveDeliveryFees({ ...res.data, loading: false, country: deliveryRestaurantCountry });
            return true;
          } else {
            this.props.saveDeliveryFees({ totalFee: 0, totalFeeCurrency: 'VND', loading: false, country: deliveryRestaurantCountry }); //initially set zero.
            this.setState({checkDeliveryRange: false});
            return true;
          }
        })
        .catch((err) => {
          //console.log('ress', err);
          this.props.saveDeliveryFees({ totalFee: 0, totalFeeCurrency: 'VND', loading: false, country: deliveryRestaurantCountry }); //initially set zero.
          this.setState({checkDeliveryRange: false});
          return true;
        });
  }

  getDeliveryFees(addr, delivery_partner){
      //console.log('delivery fees', addr);
      this.getDeliveryFeeQuotation(addr.address, addr.lat, addr.long, delivery_partner);
      return true;
  }

  populateAddress(addr) {
    const { updateOrderInfo, updateCustomerPosition, orderInfo } = this.props;
    this.resetState();
    //radiAddressSelected
    //this.props.checkDeliveryRange();
    //console.log('addr', addr);
    this.setState({ radiAddressSelected: addr.cus_address_uuid });

    //const LalaMoveDeliveryFees = this.getDeliveryFeeQuotation(addr.address, addr.lat, addr.long);
    const deliveryFees = this.getDeliveryFees(addr, orderInfo.online_order_setting.delivery_partner);

    Promise.all([deliveryFees, this.calculateDistance(addr.lat, addr.long)]).then((result) => {
      //console.log('populate result', result);

      var addObj = '';
      var lat = addr.lat;
      var lng = addr.long;
      var address = addr.address;
      if (!addr.address_json) {
        //check if old address format
        var addressToFragment = addr.address;
        var addressSplited = addressToFragment.split(',');
        this.setState({
          localty: addressSplited[0],
          areaNstreet: addressSplited[1],

          customer_address_uuid: addr.cus_address_uuid
        });

        if (addressSplited && addressSplited.length >= 3) {
          this.setState({
            city: addressSplited[2]
          });
        }
        if (addressSplited && addressSplited.length >= 4) {
          this.setState({
            state: addressSplited[3]
          });
        }
        if (addressSplited && addressSplited.length >= 5) {
          this.setState({
            country: addressSplited[4]
          });
        }
      } else {
        try {
          addObj = JSON.parse(addr.address_json);
        } catch (e) {
          addObj = addr.address_json;
        }
        if (addr.name === 'other') {
          this.setState({ name_other_tag: addObj.address_type_other });
        }

        this.setState({
          name: addr.name,
          localty: addObj.localty,
          areaNstreet: addObj.areaNstreet,
          city: addObj.city,
          state: addObj.state,
          country: addObj.country,
          landmark: addObj.landmark && addObj.landmark != undefined ? addObj.landmark : '',
          customer_address_uuid: addr.cus_address_uuid,
          lat,
          lng
        });
      }
      this.setState({ error: {} });
      updateOrderInfo({
        customerLat: lat,
        customerLng: lng,
        customerAddress: address
      });
      // Update customer position for next order
      updateCustomerPosition({ lat, lng, address });
      if (this.formValid()) {
        this.setState({ isFormValid: true, addressToggle: 'hide' });
        this.toggleAddress('hide');
      } else {
        this.setState({ isFormValid: false, addressToggle: 'show' });
        this.toggleAddress('show');
      }
      orderInfo.online_order_setting.delivery_partner === 'internal' && this.checkDeliveryRange();
    });
  }
  // toggle address show hide
  toggleAddress(opt) {
    this.props.toggleAddressState(opt);
    this.setState({ addressToggle: opt });
  }

  validateForm() {
    this.setState({ checkPageLoaded: false });
    const { t } = this.props;
    const { name, areaNstreet, error, name_other_tag } = this.state;
    /* if (!localty) {
      error.localty = t('VALIDATE.ENTER_LOCALTY');
    } else {
      delete error.localty;
    } */
    if (!areaNstreet) {
      error.areaNstreet = t('VALIDATE.ENTER_AREA_AND_STREET');
    } else {
      delete error.areaNstreet;
    }

    if (name === 'other' && name_other_tag === '') {
      error.name_other_tag = t('VALIDATE.ENTER_OTHER_ADDRESS_TYPE');
    } else {
      delete error.name_other_tag;
    }
    if (Object.keys(error).length > 0) {
      this.setState({ error });
      return false;
    } else {
      return true;
    }
  }

  formValid() {
    const { error } = this.state;
    const isFormValid = Object.keys(error).length > 0 ? false : true;
    if (isFormValid) {
      return true;
    } else {
      return false;
    }
  }

  render() {
    const { t, orderInfo, isLoggedIn, orderType, duration, deliveryFeeErrorObject, isBtnDisabled, addressToggleCheckout, savedDistance, deliveryFees, deliveryFee } = this.props;
    const { style, name, localty, areaNstreet, city, state, country, landmark, error, addressToggle, name_other_tag, isFormValid, radiAddressSelected, checkDeliveryRange } = this.state;

    var work = false;
    var home = false;
    var other = false;
    if (name == 'work') work = true;
    else if (name === 'home') home = true;
    else other = true;
    //console.log('this.props.address', this.props.address);

    const currencySymbol = orderInfo.currency.symbol;
    const isDeliveryRangeValid = checkDeliveryRange;

    let addressSelected = '';
    if(radiAddressSelected != ''){
     addressSelected =  this.props.address.length > 0 && this.props.address.find(addr=>addr.cus_address_uuid == radiAddressSelected);
    }

    return (
      <div className="checkout-address">
        {isLoggedIn && (
          <div className="logged">
            <div className={`address-container ${orderType === 3 ? '' : 'd-none'}`}>
              {orderType == 3 && addressToggleCheckout == '' ? (
                <div className={`number ${isBtnDisabled || addressToggle === 'show' ? 'active' : ''}`}>
                  <span>2</span>
                </div>
              ) : (
                  <div className="number">
                    <span>2</span>
                  </div>
                )}

              <div className="address-wrapper-outer">
                    <label>
                    {t('LABEL.DELIVERY_ADDRESS')}
                    {
                    deliveryFees.loading === true ?
                    <LoadingIcon />:
                    <div className="w-50 float-right font-weight-normal dis-text">
                      {isDeliveryRangeValid && duration / 60 > 0 && (
                        <div className="d-block w-100 text-right font-weight-bold" style={{color: '#697bef'}}>
                          &nbsp;·&nbsp;{Math.ceil(duration / 60)} {t('UNIT.min')}
                        </div>
                      )}
                      {(savedDistance != '' || !isDeliveryRangeValid) && (
                        <div>
                            {savedDistance!='' && <div className="d-block w-100 text-right font-weight-bold" style={{color: '#697bef'}}>
                            {roundTo(parseFloat(savedDistance), 1)} {DISTANCE_UNIT}
                            </div>}
                          {!isDeliveryRangeValid && <div className="distance-validate">{t('LABEL.OUT_OF_DELIVERY_RANGE')}</div>}
                            <div className="d-block w-100">
                            {isDeliveryRangeValid && !deliveryFeeErrorObject && savedDistance != '' && <span>{deliveryFee == 0? t('LABEL.FREE_SHIPPING'):''}</span>}
                              {/* {isDeliveryRangeValid && deliveryFeeErrorObject && (
                                <span>{deliveryFeeErrorObject.fee > 0 ? getCurrency(deliveryFeeErrorObject.fee, currencySymbol) : t('LABEL.FREE_SHIPPING')}&nbsp;·&nbsp;</span>
                              )} */}
                           </div>
                        </div>
                      )}

                    </div>}

                  </label>


                <div className={`${addressToggleCheckout}  ${isDeliveryRangeValid && isFormValid && addressToggle == 'hide' ? 'd-none' : ''}`}>
                  <div className="address-wrapper">
                    <div className={`addressList ${style} `}>
                      {this.props.address &&
                        this.props.address.map((data, i = this.state.style) => {
                          var viewAddObj = '';
                          try {
                            viewAddObj = JSON.parse(data.address_json);
                          } catch (e) {
                            viewAddObj = data.address_json;
                          }
                          return (
                            <div className={`info-row ${i >= 2 ? 'd-none' : ''}`} key={data.cus_address_uuid}>
                              <div className="address-name">
                                <label>
                                  <input
                                    type="radio"
                                    name="addresslist"
                                    value={data.cus_address_uuid}
                                    className=""
                                    checked={data.cus_address_uuid == radiAddressSelected ? true : false}
                                    onChange={() => this.populateAddress(data)}
                                  />
                                  <span className="checkmark"></span>
                                  {viewAddObj && viewAddObj.address_type_other != undefined ? viewAddObj.address_type_other : data.name}
                                  <i className={`${data.name.toLowerCase() === 'home' ? 'icon-hottab-home pl-1' : 'icon-hottab-hotel pl-1'}`} />
                                </label>
                              </div>
                              <div className="address-detail">{parseAddress(data.address)}</div>
                              {i === 1 && this.props.address.length > 2 ? (
                                <span className="showmore" onClick={this.showAddress}>
                                  {t('LABEL.SHOW_MORE')}
                                </span>
                              ) : (
                                  ''
                                )}
                              {i === this.props.address.length - 1 && this.props.address.length > 2 ? (
                                <span className="showless" onClick={this.hideAddress}>
                                  {t('LABEL.SHOW_LESS')}
                                </span>
                              ) : (
                                  ''
                                )}
                            </div>
                          );
                        })}
                    </div>
                    <div className="use-my-curr-address">
                      <span className="material-icons md-18 location-searching">location_searching</span>
                      <span onClick={this.getCurrentAddress} className="get-curr-loc">
                        {t('LABEL.USE_MY_CURRENT_ADDRESS')}
                      </span>
                      {addressToggle && (
                        <div className="btn-toggle" onClick={() => this.toggleAddress(addressToggle === 'show' ? 'hide' : 'show')}>
                          <i className={`icon-hottab-angle-${addressToggle != '' || addressToggle != 'hide' ? 'up' : ''} icon-angle`}></i>
                        </div>
                      )}
                    </div>
                    <AutoCompleteAddress
                      name="areaNstreet"
                      value={areaNstreet}
                      onFocusAddress={() => this.onFocusAddress()}
                      onBlurAddress={() => this.onBlurAddress()}
                      handleInputChange={this.handleInputChange}
                      chooseAddress={this.chooseAddress}
                      placeHolder={t('PLACEHOLDER.TYPE_YOUR_ADDRESS')}
                    />
                    {error.areaNstreet && <div className="error-message">{error.areaNstreet}</div>}
                    <input type="text" name="localty" placeholder={t('PLACEHOLDER.LOCALTY')} onChange={this.handleInputChange} value={localty} style={{ margin: '10px 0 0 0' }} />
                    {/* {error.localty && <div className="error-message">{error.localty}</div>} */}


                    <div className="address-type-wrapper">
                      <label>{t('LABEL.ADDRESS_TYPE')}</label>
                      <div className="address-type">
                        <label>
                          <input name="name" type="radio" value="work" checked={work} onChange={this.handleInputChange} />
                          <span className="checkmark"></span>
                          {t('LABEL.WORK')}
                        </label>
                        <label>
                          <input name="name" type="radio" value="home" checked={home} onChange={this.handleInputChange} />
                          <span className="checkmark"></span>
                          {t('LABEL.HOME')}
                        </label>
                        <label>
                          <input name="name" type="radio" checked={other} value="other" onChange={this.handleInputChange} />
                          {t('LABEL.OTHER')}
                        </label>
                        {name === 'other' && (
                          <label>
                            <input name="name_other_tag" type="text" value={name_other_tag} placeholder={t('PLACEHOLDER.ADDRESS_TYPE')} onChange={this.handleInputChange} />
                            {error.name_other_tag && <div className="error-message">{error.name_other_tag}</div>}
                          </label>
                        )}
                      </div>
                    </div>
                    <div className="saveaddress" onClick={this.addAddress}>
                      {t('LABEL.SAVEANDDELIVERHERE')}
                    </div>
                  </div>
                </div>
                <div className={`address-detail ${isDeliveryRangeValid && isFormValid && addressToggle == 'hide' && addressToggle != '' ? 'show' : 'hide'}`}>
                  <div className={`address ${addressToggle === 'show' ? 'hide' : ''}`}>
                    <strong>{name}: </strong>
                    {addressSelected!=''? parseAddress(addressSelected.address):''}
                  </div>
                  {(addressToggle === '' || addressToggle === 'hide') && (
                    <div className="btn-toggle" onClick={() => this.toggleAddress(addressToggle === 'show' ? 'hide' : 'show')}>
                      <i className={`icon-hottab-angle-${addressToggle === '' || addressToggle === 'hide' ? 'down' : 'up'} icon-angle`}></i>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default CheckoutAddress;
