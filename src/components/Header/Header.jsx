import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import BgImage from 'components/BgImage';
import classNames from 'classnames';
import { history } from 'store';
import { ENV } from 'constants/api';

import './css/style.scss';
@withTranslation('translations')
class Header extends React.Component {
  constructor(props) {
    super(props);

    this.state = {

    };

  }


  componentDidMount() {
  }

  componentWillUnmount() {
  }

  componentDidUpdate() {
  }


  onClickLogo() {
    history.push('/');
  }


  render() {
    const { t } = this.props;

    const { suggestionOpened, scrollHeight, fixed } = this.state;

    return (

        <header className={`total-width mx-auto p-0 ${scrollHeight > 210 ? 'fixed_header' : ''}`}>
          <div className={`header ${fixed ? 'fixed' : ''}`}>
            <div className="clearfix">
              <button className="hamburger d-lg-none">
                <span className="hamburger-box">
                  {!suggestionOpened ? <span onClick={this.toggleMenu} ref={(node) => (this.toggleRef = node)} className="hamburger-inner"></span> : ''}
                </span>
              </button>
              <div className="logo" onClick={() => this.onClickLogo()}>

              </div>

              <div className="header-actions">
                <div className={classNames({ headerright: true, 'position-static': !fixed })}>
                </div>
              </div>


            </div>
            {t('LABEL.HEADER')}
          </div>

        </header>

    );
  }
}

export default Header;
