import React from 'react';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { Modal, ModalBody } from 'reactstrap';

import VoucherIcon from 'components/VoucherIcon';
import BgImage from 'components/BgImage';
import CheckoutCartItem from 'components/CheckoutCartItem';
import SelectOrderType from 'components/SelectOrderType';
import {
  calculateItemPrice,
  calculateItemGrossPrice,
  getCurrency,
  getOrderTax,
  checkOrderingMethodAvailable,
  validateOrderPrice,
  calculateSubtotal,
  ORDER_TYPE,
  prodForLoyalty,
  getDistance,
  roundTo,
  isRestaurantOpenNow,
  formatString
} from 'utils';
import { decreaseQuantity, increaseQuantity, updateSopaPoints } from 'store/actions/order';
import { updateOrderInfo } from 'store/actions/order';
import { getRestaurantDetail } from 'services/restaurant';
import { history } from 'store';
import { loyaltyPoints } from 'services/order';
import LoadingIcon from 'components/LoadingIcon';

import './css/style.scss';

@withTranslation('translations')
@connect(
  (state) => ({
    lang: state.config.lang,
    orderType: state.config.order_type,
    orderItems: state.order.items,
    orderInfo: state.order.info,
    sopaPoints: state.order.sopaPoints,
    position: state.config.position
  }),
  {
    decreaseQuantity,
    increaseQuantity,
    updateOrderInfo,
    updateSopaPoints
  }
)
class CheckoutCart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      modalOpened: false,
      loyaltyLoading: ''
    };

    this.toggleModal = this.toggleModal.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  handleClickOutside(event) {
    if (this.cartRef && !this.cartRef.contains(event.target)) {
      this.toggleModal();
    }
  }
  componentDidMount() {
    const { orderItems } = this.props;
    //console.log('orderItems', orderItems);

    this.props.onItemRef && this.props.onItemRef(this);
    document.addEventListener('mousedown', this.handleClickOutside);
    this.setState({ loyaltyLoading: true });
    // console.log('sopaPoints', sopaPoints);

    // showing loyalty in cart
    /* loyaltyPoints(prodForLoyalty(orderItems)).then((res) => {
      this.setState({ loyaltyPointToGet: res.data.pointsToConsumer, unit: res.data.unit, loyaltyLoading: false });
      updateSopaPoints(res.data.pointsToConsumer);
    }); */
  }
  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }
  componentDidUpdate(prevProps, prevState) {
    const { orderItems } = this.props;
    const playersOne = orderItems;
    const playersTwo = prevProps.orderItems;
    //JSON.stringify(playersOne) == JSON.stringify(playersTwo)
    //var isSame = playersOne.length === playersTwo.length && playersOne.every((o,i) => Object.keys(o).length === Object.keys(playersTwo[i]).length && Object.keys(o).every(k => o[k] === playersTwo[i][k]));
    //const isEqual =Object.entries(orderItems).toString() === Object.entries(prevProps.orderItems).toString();
    var isSame = JSON.stringify(playersOne) == JSON.stringify(playersTwo);
    // console.log('isSame', isSame);

    if (!isSame) {
      // console.log('sopaPoints fg', orderItems);
      //this.setState({ loyaltyLoading: true });
      /* loyaltyPoints(prodForLoyalty(orderItems)).then((res) => {
        this.setState({ loyaltyPointToGet: res.data.pointsToConsumer, unit: res.data.unit, loyaltyLoading: false });
        updateSopaPoints(res.data.pointsToConsumer);
      }); */
    }

    if (this.state.modalOpened && this.state.modalOpened !== prevState.modalOpened) {
      // Update restaurant data from API

      this.getRestaurantData();
      //showing loyalty in cart
      // if (orderItems !== prevProps.orderItems) {
      //console.log('header cart', loyaltyLoading);

      //}
    }
  }

  toggleModal() {
    this.setState({ modalOpened: !this.state.modalOpened });
    this.props.toggleModal && this.props.toggleModal();
  }

  getRestaurantData() {
    const { orderInfo, updateOrderInfo } = this.props;
    if (!orderInfo.outlet_uuid) return;
    getRestaurantDetail(orderInfo.outlet_uuid).then((res) => {
      if (!res) return;
      if (!res.error) {
        updateOrderInfo(res.data);
      }
    });
  }

  redirectRestaurant(slug) {
    history.push(`/${slug}`);
    this.toggleModal();
  }

  redirectCheckout() {
    history.push('/checkout');
    this.toggleModal();
  }

  checkOrderingMethodValid() {
    const { orderInfo, orderType } = this.props;
    const doDelivery = checkOrderingMethodAvailable(ORDER_TYPE.DELIVERY, orderInfo);
    const doTakeaway = checkOrderingMethodAvailable(ORDER_TYPE.TAKE_AWAY, orderInfo);
    const doDinein = checkOrderingMethodAvailable(ORDER_TYPE.DINE_IN, orderInfo);
    if (orderType === ORDER_TYPE.DELIVERY && !doDelivery) return false;
    if (orderType === ORDER_TYPE.TAKE_AWAY && !doTakeaway) return false;
    if (orderType === ORDER_TYPE.DINE_IN && !doDinein) return false;
    return true;
  }

  checkSuspendOrderingMethod() {
    const { orderInfo, orderType } = this.props;
    const setting = orderInfo.online_order_setting;
    //console.log('setting', orderInfo);
    const doDinein = checkOrderingMethodAvailable(ORDER_TYPE.DINE_IN, orderInfo);
    if (
      (orderType === ORDER_TYPE.DELIVERY && setting.suspend_delivery) ||
      (orderType === ORDER_TYPE.TAKE_AWAY && setting.suspend_takeaway) ||
      (orderType === ORDER_TYPE.DINE_IN && !doDinein)
    ) {
      return false;
    }
    return true;
  }

  checkPlaceOrderValid() {
    const { orderItems, orderInfo } = this.props;
    const is_restaurant_open = Object.keys(orderInfo).length > 0 && isRestaurantOpenNow(orderInfo);
    //console.log('is_restaurant_open', is_restaurant_open);
    if (!is_restaurant_open) return true;
    const subtotal = calculateSubtotal(orderItems).discountedSubtotal;
    const orderPriceStatus = validateOrderPrice(orderInfo, subtotal);
    const orderingMethodStatus = this.checkOrderingMethodValid();
    const suspendStatus = this.checkSuspendOrderingMethod();
    return orderPriceStatus !== 3 || !orderingMethodStatus || !suspendStatus;
  }

  // getErrorMessage() {
  //     return(
  //         ((!orderingMethodStatus || !suspendStatus) && <div className={`triangle_${orderType}`}></div>)
  //         (orderType === 1 && <ol className="error-message">
  //             {!orderingMethodStatus && <li>{t('VALIDATE.CART_WRONG_ORDER_TIME')}</li>}
  //         </ol>)
  //         ((orderType === 2 || orderType === 3) && <ol className="error-message">
  //             {!orderingMethodStatus && suspendStatus && <li>{t('VALIDATE.CART_WRONG_ORDER_TIME')}</li>}
  //             {!suspendStatus && <li>{t('VALIDATE.SUSPEND_METHOD')}</li>}
  //         </ol>)
  //     );
  // }

  render() {
    const { t, lang, className, btnLabel, orderItems, orderInfo, orderType, position } = this.props;
    const { modalOpened, loyaltyPointToGet, loyaltyLoading } = this.state;
    let estDistance = 0;
    if (position && position.latitude && position.longitude) {
      estDistance = getDistance(
        {
          lat: position.latitude,
          lng: position.longitude
        },
        {
          lat: +orderInfo.lat,
          lng: +orderInfo.long
        }
      );
    }
    //console.log('orderInfo', orderInfo);
    if (orderItems.length === 0) {
      // Empty cart
      return (
        <Modal isOpen={modalOpened} toggle={this.toggleModal} className={className}>
          <ModalBody>
            <div className="modal-content-inner">
              <div className="cart-content-empty">
                <div className="btn-close" onClick={this.toggleModal}></div>
                <div className="cart-empty">
                  <img src="/images/no-data.png" alt="" />
                  <p>{t('LABEL.SHOPPING_CART_EMPTY')}</p>
                </div>
              </div>
            </div>
          </ModalBody>
        </Modal>
      );
    }
    const onlineOrderSetting = orderInfo.online_order_setting;
    // Restaurant info
    const restaurantTranslation = orderInfo.translations ? orderInfo.translations.find((obj) => obj.lang_iso_code === lang) : null;
    const restaurantName = (restaurantTranslation && restaurantTranslation.name) || orderInfo.name || '';
    const restaurantImage = orderInfo.logo;
    const delivery_partner = onlineOrderSetting.delivery_partner;
    //console.log('delivery_partner', delivery_partner);
    const currencySymbol = Object.keys(orderInfo).length > 0 && orderInfo.currency.symbol;
    // Sub total
    let subtotal = 0;
    let grosstotal = 0;
    for (let item of orderItems) {
      subtotal += calculateItemPrice(item);
      grosstotal += calculateItemGrossPrice(item);
    }
    // Tax
    let taxes = [];
    //console.log('onlineOrderSetting', orderInfo);
    const consumer_taxes = onlineOrderSetting != undefined && onlineOrderSetting.consumer_taxes;
    const taxSetting = typeof consumer_taxes === 'string' ? JSON.parse(consumer_taxes) : consumer_taxes;
    if (orderInfo.categories) {
      taxes = getOrderTax(orderItems, taxSetting, orderInfo.categories);
    }
    const totalTax = taxes.reduce((acc, cur) => acc + cur.amount, 0);
    // Total price
    const totalPrice = subtotal + totalTax;
    // Order price validation
    const orderPriceStatus = Object.keys(orderInfo).length > 0 && validateOrderPrice(orderInfo, subtotal);
    // Ordering method checking
    const orderingMethodStatus = this.checkOrderingMethodValid();
    // Suspend checking
    const suspendStatus = Object.keys(orderInfo).length > 0 && this.checkSuspendOrderingMethod();
    // Check place order valid
    const placeOrderValid = this.checkPlaceOrderValid();
    const voucherPercentage = orderInfo.enabled_voucher_program
      ? orderType === ORDER_TYPE.DELIVERY
        ? orderInfo.voucher_setting.delivery_amount
        : orderInfo.voucher_setting.takeaway_amount
      : 0;
    return (
      <Modal backdrop={false} isOpen={modalOpened} toggle={this.toggleModal} className={className}>
        <ModalBody>
          <div className="cart-triangle"></div>
          <div isOpen={modalOpened} className={`modal-body ${modalOpened ? '' : 'hide-header-cart'}`} ref={(node) => (this.cartRef = node)}>
            <div className="modal-content-inner header-cart">
              <div className="cart-content">
                <div className="btn-close" onClick={this.toggleModal}></div>
                <div className="restaurant-info d-none d-md-flex">
                  <div className="img-wrapper">
                    <BgImage src={restaurantImage} width={40} height={40} />
                  </div>
                  <div className="detail">
                    <h4 title={restaurantName} onClick={() => this.redirectRestaurant(orderInfo.slug)}>
                      {restaurantName}
                    </h4>
                    <div className="address-wrapper">
                      <div className="address" title={orderInfo.address}>
                        {orderInfo.address}
                      </div>
                      {estDistance > 0 && (
                        <div className="distance">
                          <span>|</span>
                          {+roundTo(estDistance / 1000, 1) > 0 ? `${(estDistance / 1000).toFixed(1)} km` : `${estDistance.toFixed(0)} m`}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="order-type">
                  <div className="order-type-inner">
                    <SelectOrderType />
                    {
                      <div className="header checkout-error">
                        {Object.keys(orderInfo).length > 0 && !isRestaurantOpenNow(orderInfo) ? (
                          orderType <= 3 && (
                            <React.Fragment>
                              <div className={`triangle_${orderType}`}></div>
                              <ol className="error-message">{<li>{t('VALIDATE.CART_WRONG_OPEN_TIME')}</li>}</ol>
                            </React.Fragment>
                          )
                        ) : (
                            <React.Fragment>
                              {(!orderingMethodStatus || !suspendStatus) && <div className={`triangle_${orderType}`}></div>}
                              {orderType === 1 && !orderingMethodStatus && (
                                <ol className="error-message">
                                  {' '}
                                  <li>{t('VALIDATE.CART_WRONG_ORDER_TIME')}</li>{' '}
                                </ol>
                              )}

                              {(orderType === 2 || orderType === 3) && (
                                <ol className="error-message">
                                  {!orderingMethodStatus && suspendStatus && <li>{t('VALIDATE.CART_WRONG_ORDER_TIME')}</li>}
                                  {!suspendStatus && <li>{t('VALIDATE.SUSPEND_METHOD')}</li>}
                                </ol>
                              )}
                              {/* {((orderType === 2 || orderType === 3) && (!orderingMethodStatus && suspendStatus)) && <ol className="error-message"> {<li>{t('VALIDATE.CART_WRONG_ORDER_TIME')}</li>} {!suspendStatus && <li>{t('VALIDATE.SUSPEND_METHOD')}</li>} </ol> } */}
                            </React.Fragment>
                          )}
                      </div>
                    }
                  </div>
                </div>
                <div className="disclaimer">
                {/* orderType === 3 && delivery_partner === 'lalamove' && <span>{formatString(t('LABEL.DISCLAIMER_ORDER_TYPE_3'), 'Lalamove')}</span> */}
                {orderType === 3 && delivery_partner === 'internal' && <span>{formatString(t('LABEL.DISCLAIMER_ORDER_TYPE_3_INTERNAL'), 'merchant')}</span>}
                  {orderType === 2 && <span>{formatString(t('LABEL.DISCLAIMER_ORDER_TYPE_2'), restaurantName)}</span>}
                  {orderType === 1 && <span>{formatString(t('LABEL.DISCLAIMER_ORDER_TYPE_1'), restaurantName)}</span>}
                </div>
                <div className="cart-desc">
                  <div className={`total-price ${orderPriceStatus !== 3 ? 'price-disable' : ''}`}>{getCurrency(totalPrice, currencySymbol)}</div>
                  {delivery_partner === 'internal' && orderPriceStatus === 1 && onlineOrderSetting.min_delivery_cost && (
                    <div className="price-hint">
                      {t('LABEL.MIN_ORDER')}: {getCurrency(onlineOrderSetting.min_delivery_cost, currencySymbol)}
                    </div>
                  )}
                  {delivery_partner === 'internal' && orderPriceStatus === 2 && onlineOrderSetting.max_delivery_cost && (
                    <div className="price-hint">
                      {t('LABEL.MAX_ORDER')}: {getCurrency(onlineOrderSetting.max_delivery_cost, currencySymbol)}
                    </div>
                  )}
                  {orderPriceStatus === 3 && orderInfo.enabled_voucher_program && orderInfo.voucher_setting && (
                    <div className="voucher-hint">
                      {t('LABEL.REWARDED_VOUCHER_AMOUNT')}: {getCurrency((subtotal * voucherPercentage) / 100, currencySymbol)}
                    </div>
                  )}
                  {/* {loyaltyPointToGet > 0 && orderPriceStatus === 3 && (
                    <div className="fee-row loyalypoints voucher-hint">
                      {t('LABEL.LOYALTY_POINTS')}: {loyaltyLoading ? <LoadingIcon /> : Number(loyaltyPointToGet).format()}
                    </div>
                  )} */}
                  <div className="cart-items">
                    {orderItems.map((item, i) => {
                      return <CheckoutCartItem item={item} index={i} toggleModal={this.toggleModal} key={`${item.item_uuid}-${i}`} />;
                    })}
                    <div className="fee">
                      <div className="fee-row">
                        <label>{t('LABEL.SUBTOTAL')}</label>
                        <div className="value">
                          {grosstotal != subtotal ? (
                            <span>
                              <span className="line-through">{getCurrency(grosstotal, currencySymbol)}</span> {getCurrency(subtotal, currencySymbol)}
                            </span>
                          ) : (
                              getCurrency(subtotal, currencySymbol)
                            )}
                        </div>
                      </div>
                      {taxes.map((tax) => {
                        if (tax.amount === 0) return null;
                        return (
                          <div className="fee-row" key={tax.tax_uuid}>
                            <label>
                              {tax.name} ({tax.value}%)
                            </label>
                            <div className="value">{getCurrency(tax.amount, currencySymbol)}</div>
                          </div>
                        );
                      })}
                      {grosstotal - subtotal > 0 && (
                        <div className="total-saving">
                          <label>{t('LABEL.TOTAL_SAVING')}</label>
                          <span>{getCurrency(grosstotal - subtotal, currencySymbol)}</span>
                        </div>
                      )}

                    </div>
                  </div>
                </div>
              </div>
            </div>
            {orderInfo.enabled_voucher_program && <div className="voucher-hint-footer">
              <div className="voucher-inner">
                <VoucherIcon />
                <span className="text voucherInfo">{t('LABEL.YOU_WILL_RECEIVE_VOUCHER')}</span>
              </div>
            </div>}
            <div className="modal-actions">
              <button className="btn btn-type-2 btn-place" disabled={placeOrderValid} onClick={() => this.redirectCheckout()}>
                {btnLabel} {/* getCurrency(totalPrice, currencySymbol) */}
              </button>
            </div>
          </div>
        </ModalBody>
      </Modal>
    );
  }
}

export default CheckoutCart;
