import React from 'react';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { Modal, ModalBody } from 'reactstrap';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { history } from 'store';

import BgImage from 'components/BgImage';
import { saveNewImage } from 'services/media';
import { updateCustomer } from 'store/actions/auth';
import { logout } from 'services/auth';
import { updateCustomerInfo } from 'services/customer';
import LoadingIcon from 'components/LoadingIcon';
import { setAuthState, resetUserInfo, getWalletBalance } from 'store/actions/auth';
import { saveNotification } from 'store/actions/notification';
import { clearOrderHistory, resetCart } from 'store/actions/order';
import { getBalance } from 'services/customer';

import './css/style.scss';

@withTranslation('translations')
@connect(
  (state) => ({
    token: state.auth.token,
    registrationToken: state.auth.registration_token,
    isLoggedIn: state.auth.loggedIn,
    customer: state.auth.customer,
    router: state.router,
    balance: state.auth.balance
  }),
  {
    updateCustomer,
    getWalletBalance,
    setAuthState,
    resetUserInfo,
    clearOrderHistory,
    saveNotification,
    resetCart
  }
)
class AccountInfo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      modalOpened: false,
      requestPending: false,
      balanceLoading: false
    };

    this.toggleModal = this.toggleModal.bind(this);
    // this.getUserBalance = this.getUserBalance.bind(this);
    this.selectAvatar = this.selectAvatar.bind(this);
  }

  componentDidMount() {
    this.props.onItemRef && this.props.onItemRef(this);
  }

  selectAvatar(e) {
    if (this.requestPending) return;
    this.requestPending = true;
    const { token, updateCustomer } = this.props;
    const file = e.target.files[0];
    const params = {
      photo: file
    };

    this.setState({ requestPending: true });
    saveNewImage(params, token).then((res) => {
      this.requestPending = false;
      this.setState({ requestPending: false });
      if (res && !res.error) {
        const avatar = res.data.absolute_path;
        // Save avatar to database
        updateCustomerInfo(
          {
            avatar
          },
          token
        );
        // Update avatar in store
        updateCustomer({
          avatar
        });
      }
    });
  }

  logout(hideMenu) {
    const { t, setAuthState, resetUserInfo, clearOrderHistory, token, registrationToken, saveNotification, resetCart } = this.props;
    logout(registrationToken, token);
    // Reset user info
    setAuthState(false);
    resetUserInfo();
    clearOrderHistory();
    saveNotification([]);
    resetCart();
    toast.info(t('TOAST.appSignoutSuccess'));
    this.toggleModal();
    if (hideMenu) {
      this.setState({ menuOpened: false });
    }
    history.push('/');
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.modalOpened && this.state.modalOpened !== prevState.modalOpened) {
     // this.props.isLoggedIn && this.updateSopaBalance();
      // Update restaurant data from API
      //this.getRestaurantData();
    }
  }

  updateSopaBalance() {
    //update user's sopa points
    const { token, getWalletBalance, customer } = this.props;
    let params = { consumer_uuid: customer.customer_uuid };
    this.setState({ balanceLoading: true });
    getBalance(params, token).then((res) => {
      if (res) {
        getWalletBalance({
          balance: res.data.balance
        });
        this.setState({ balanceLoading: false });
      }
    });
  }

  toggleModal() {
    this.setState({ modalOpened: !this.state.modalOpened });
    this.props.toggleModal && this.props.toggleModal();
  }

  render() {
    const { modalOpened, requestPending, balanceLoading } = this.state;
    const { t, customer, balance, isLoggedIn } = this.props;
    //console.log('balance', customer);

    return (
      <Modal isOpen={modalOpened} toggle={this.toggleModal} className={this.props.className}>
        <ModalBody>
          <div className="modal-content-inner account-info">
            <div className="account-content">
              <div className="btn-close" onClick={this.toggleModal}></div>
              <div className="customerheader">
                <div className="customer-avatar">
                  {requestPending && isLoggedIn && !customer.avatar ? (
                    <LoadingIcon />
                  ) : (
                      isLoggedIn &&
                      !customer.avatar && (
                        <label htmlFor="avatar" className="avatar">
                          <i className="icon-hottab-user icon-user"></i>
                          <input type="file" id="avatar" onChange={this.selectAvatar} accept="image/*" />
                          <i className="icon-hottab-camera icon-camera"></i>
                        </label>
                      )
                    )}
                  {requestPending && isLoggedIn && customer.avatar ? (
                    <LoadingIcon />
                  ) : (
                      isLoggedIn &&
                      customer.avatar && (
                        <label htmlFor="avatar" className="avatar">
                          <BgImage src={customer.avatar} fallbackSrc={customer.avatar} width={100} height={100} />
                          <input type="file" id="avatar" onChange={this.selectAvatar} accept="image/*" />
                          <i className="icon-hottab-camera icon-camera"></i>
                        </label>
                      )
                    )}
                </div>
                <div className="customerInfo">
                  {/* <div className="balance">
                    {balanceLoading ? (
                      <LoadingIcon />
                    ) : (
                        <div>
                          <div className="pb-2">
                            <span>{balance}</span> <i className="icon-hottab-angle-right"></i>
                          </div>
                          <label>{t('LABEL.SOPA_POINTS')}</label>
                        </div>
                      )}
                  </div> */}
                  <div className="fullname">
                    <span>{isLoggedIn && customer.name}</span>
                  </div>
                  {customer != undefined && customer.phone && <div className="phone">
                    <span>
                      +{isLoggedIn && customer.country_code}-{isLoggedIn && customer.phone}
                    </span>
                  </div>}
                </div>
              </div>
              <div className="customerBody">
                <Link to="/customer/account/profile" onClick={this.toggleModal}>
                  <div className="address">
                    {/* <span className="material-icons google-address">location_on</span> */}

                      <span>{t('LABEL.MY_PROFILE')}</span>

                    <i className="icon-hottab-angle-right"></i>
                  </div>
                </Link>
                <Link to="/customer/account/profile/edit" onClick={this.toggleModal}>
                  <div className="settings">
                    {/* <span className="material-icons">settings</span> */}
                    <span>{t('LABEL.MODEL_ACCOUNT_SETTINGS')}</span>
                  <i className="icon-hottab-angle-right"></i>
                  </div>
                </Link>
                <Link to="/customer/voucher" onClick={this.toggleModal}>
                  <div className="settings">
                  {/* <span className="material-icons">settings</span> */}
                    <span>{t('HEADER.VOUCHER')}</span>
                  <i className="icon-hottab-angle-right"></i>
                  </div>
                </Link>
                <Link to="/customer/order" onClick={this.toggleModal}>
                  <div className="address">
                  {/* <span className="material-icons google-address">location_on</span> */}
                    <span>{t('HEADER.ORDERS')}</span>
                  <i className="icon-hottab-angle-right"></i>
                  </div>
                </Link>
                <Link to="" onClick={() => this.logout(true)}>
                  <div className="settings">
                  {/* <span className="material-icons">logout</span> */}
                    <span>{t('LINK.LOGOUT')}</span>
                  <i className="icon-hottab-angle-right"></i>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </ModalBody>
      </Modal>
    );
  }
}

export default AccountInfo;
