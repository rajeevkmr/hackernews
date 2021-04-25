import React from 'react';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import moment from 'moment';

import './css/style.scss';

@withTranslation('translations')
@connect(
  (state) => ({
    lang: state.config.lang
  }),
  null
)
class Footer extends React.Component {
  render() {
    const { t } = this.props;
    const year = moment().format('YYYY');
    return (
      <React.Fragment>

          <div className="footer container-fluid p-0">
            <footer className="footer-size total-width d-none d-lg-flex justify-content-between align-items-center">
              <span className="copyright">© {year}</span>
              {t('LABEL.FOOTER')}
            </footer>
          </div>

      </React.Fragment>
    );
  }
}

export default Footer;
