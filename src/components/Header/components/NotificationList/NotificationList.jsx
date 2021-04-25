import React from 'react';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import moment from 'moment';

import BgImage from 'components/BgImage';
import { getNotifications } from 'services/notification';
import { buildNotificationMessage, timezoneOffset } from 'utils';
import { history } from 'store';
import { saveNotification } from 'store/actions/notification';

@withTranslation('translations')
@connect(
  (state) => ({
    isLoggedIn: state.auth.loggedIn,
    token: state.auth.token,
    notifications: state.notification.list
  }),
  {
    saveNotification
  }
)
class NotificationList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      page: 1,
      hasMore: true,
      notificationOpened: false
    };

    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.toggleNotification = this.toggleNotification.bind(this);
    this.getNotificationList = this.getNotificationList.bind(this);
    this.scrollHandler = this.scrollHandler.bind(this);
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
    this.getNotificationList();
  }

  componentDidUpdate(prevProps) {
    if ((this.props.isLoggedIn && this.props.isLoggedIn !== prevProps.isLoggedIn) || this.props.notifications.length != prevProps.notifications.length) {
      this.getNotificationList();
    }
    if (!this.props.isLoggedIn && this.props.isLoggedIn !== prevProps.isLoggedIn) {
      // Logout then clear notification
      this.props.saveNotification([]);
      this.setState({
        page: 1,
        hasMore: true
      });
    }
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
    if (this.notificationRef) {
      this.notificationRef.removeEventListener('scroll', this.scrollHandler);
    }
  }

  handleClickOutside(event) {
    if (!event.target) {
      return;
    }
    if (this.drawerRef && !this.drawerRef.contains(event.target) && !this.drawerRef.contains(event.target.parentElement.nextElementSibling)) {
      this.setState({
        drawerOpened: false
      });
    }
    if (this.notificationRef && !this.notificationRef.contains(event.target) && !this.toggleNotificationRef.contains(event.target)) {
      this.setState({
        notificationOpened: false
      });
    }
  }

  scrollHandler() {
    if (this.notificationRef.scrollTop >= this.notificationRef.scrollHeight - this.notificationRef.offsetHeight - 100) {
      if (this.state.hasMore) {
        this.getNotificationList();
      }
    }
  }

  toggleNotification() {
    this.setState({ notificationOpened: !this.state.notificationOpened }, () => {
      if (this.state.notificationOpened) {
        this.notificationRef.addEventListener('scroll', this.scrollHandler);
      } else {
        this.notificationRef.removeEventListener('scroll', this.scrollHandler);
      }
    });
  }

  getNotificationList() {
    const { token, isLoggedIn, notifications, saveNotification } = this.props;
    if (!isLoggedIn) return;
    if (this.requestPending) return;
    this.requestPending = true;
    const { page } = this.state;
    const params = {
      /* type: 2,  */
      page
    };
    getNotifications(params, token).then((res) => {
      //console.log('res.data.data', res.data.data);

      if (res && !res.error) {
        const data = notifications ? [...notifications, ...res.data.data] : [...res.data.data];
        this.setState({
          page: page + 1,
          hasMore: res.data.current_page < res.data.last_page
        });
        saveNotification(data);
      }
      this.requestPending = false;
    });
  }

  redirectLink(notification) {
    if (notification.object_type === 'voucher') {
      history.push('/customer/voucher');
      this.setState({
        notificationOpened: false
      });
      return;
    }
    if (notification.object_type !== 'order') return;
    const orderId = notification.data.order_id || notification.data.order_uuid;
    const url = notification.object_type === 'order' ? `/order/${orderId}` : `/event/${orderId}`;
    history.push(url);
    this.setState({
      notificationOpened: false
    });
  }

  render() {
    const { t, isLoggedIn, notifications } = this.props;
    const { notificationOpened, hasMore } = this.state;
    if (!isLoggedIn) return null;
    return (
      <div className="notification-list-wrapper clearfix">
        <div
          className="header-btn btn-notification mt-0"
          onClick={this.toggleNotification}
          ref={(node) => (this.toggleNotificationRef = node)}
          data-toggle="tooltip"
          data-placement="bottom"
          title={t('LABEL.NOTIFICATION')}
        >
          {/* <i className="icon-hottab-bell" aria-hidden="true" /> */}
          <div className="notification-bell">
            <span className="material-icons">notifications_none</span>
          </div>

          {/* <img src="/images/notifications-button.svg" /> */}
        </div>
        <div className={`notification-list ${notifications && notificationOpened ? '' : 'd-none'}`} ref={(node) => (this.notificationRef = node)}>
          {notifications.length > 0 && (
            <ul>
              {notifications.map((notification) => {
                const { data } = notification;
                const code = notification['gcm.notification.notification_code'] || data.notification_code;
                const notificationData = data || notification;
                const message = buildNotificationMessage(notificationData, code);
                const restaurant = notification.data ? (typeof notification.data === 'string' ? JSON.parse(notification.data) : notification.data) : null;
                //console.log('restaurant', notification);
                const restaurantLogo = restaurant && restaurant.outlet_logo ? restaurant.outlet_logo : notification['gcm.notification.outlet_logo'] || '';
                // Get date
                const time = notification.sent_at || notification.created_at;
                const createdDate = moment(time);
                const fromNow = createdDate.add(-timezoneOffset, 'minutes').fromNow();
                const fullDateTime = createdDate.format('DD/MM/YYYY HH:mm');
                return (
                  <li key={notification.notification_uuid} onClick={() => this.redirectLink(notification)}>
                    <div className="img-wrapper">
                      <BgImage src={restaurantLogo} width={40} height={40} />
                    </div>
                    <div className="notification-content">
                      <p dangerouslySetInnerHTML={{ __html: message }}></p>
                      <div className="time" title={fullDateTime}>
                        {fromNow}
                      </div>
                    </div>
                  </li>
                );
              })}
              {hasMore && (
                <li>
                  <img src="/images/loading-notification.svg" alt="" />
                </li>
              )}
            </ul>
          )}
          {notifications.length === 0 && (
            <div className="no-notification">
              <img src="/images/event-no-data.svg" alt="" />
              <p>{t('LABEL.NO_NOTIFICATIONS')}</p>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default NotificationList;
