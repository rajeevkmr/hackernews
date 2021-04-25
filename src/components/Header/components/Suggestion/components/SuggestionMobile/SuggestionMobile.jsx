import React from 'react';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';

import EmptyResult from 'components/EmptyResult';
import BgImage from 'components/BgImage';
import { getCurrency } from 'utils';

import './css/style.scss';

@withTranslation('translations')
@connect(
  (state) => ({
    lang: state.config.lang
  }),
  null
)
class SuggestionMobile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      type: 'item'
    };
  }

  componentDidUpdate(prevProps) {
    if (this.inputRef && this.props.suggestionOpened && this.props.suggestionOpened !== prevProps.suggestionOpened) {
      this.inputRef.focus();
    }
  }

  changeTab(tab) {
    if (this.state.type === tab) return;
    this.setState({
      type: tab
    });
  }

  render() {
    const {
      t,
      lang,
      keyword,
      suggestionOpened,
      searchByKeyword,
      redirectUrl,
      noResult,
      items,
      restaurants,
      handleInputChange,
      onKeyPress,
      closeSuggestion,
      clearSuggestion
    } = this.props;
    const { type } = this.state;
    return (
      <div>
        {suggestionOpened && (
          <div className={`suggestion-mobile suggestion-dropdown ${noResult ? 'no-result' : ''}`} ref={(node) => (this.suggestionRef = node)}>
            <div className="suggestion-mobile-header">
              <div className="btn-back" onClick={closeSuggestion}>
                <i className="icon-hottab-arrow-left"></i>
              </div>
              <div className="input-wrapper">
                <input
                  ref={(node) => (this.inputRef = node)}
                  type="text"
                  className="no-border"
                  placeholder={t('PLACEHOLDER.TYPE_YOUR_SEARCH')}
                  value={keyword}
                  name="keyword"
                  autoComplete="off"
                  onChange={handleInputChange}
                  onKeyPress={onKeyPress}
                />
                {keyword && (
                  <div className="close-btn" onClick={() => clearSuggestion()}>
                    <i className="icon-hottab-x"></i>
                  </div>
                )}
              </div>
            </div>
            {noResult && <EmptyResult showKeyword />}
            {!noResult && items && restaurants && (
              <ul className="suggestion-tab">
                <li className={`${type === 'item' ? 'active' : ''}`} onClick={() => this.changeTab('item')}>
                  {t('LABEL.SEARCH_ITEMS')}
                </li>
                <li className={`${type === 'restaurant' ? 'active' : ''}`} onClick={() => this.changeTab('restaurant')}>
                  {t('LABEL.PLACES')}
                </li>
              </ul>
            )}
            {!noResult && items && type === 'item' && (
              <div className="suggestion-list item-list">
                {items.length === 0 && <EmptyResult showKeyword />}
                {items.length > 0 &&
                  items.slice(0, 5).map((item, i) => {
                    const currencySymbol = item.currency ? item.currency.symbol : '₫';
                    const translation = item.translations ? item.translations.find((obj) => obj.lang_iso_code === lang) : null;
                    const itemName = (translation && translation.name) || item.name || '';
                    const outlet = item.outlet;
                    const outletTranslation = outlet.translations ? outlet.translations.find((obj) => obj.lang_iso_code === lang) : null;
                    const outletName = (outletTranslation && outletTranslation.name) || outlet.name || '';
                    return (
                      <div className="item" onClick={() => redirectUrl(outlet.slug)} key={i}>
                        <BgImage src={item.gallery ? item.gallery[0] : null} width={40} height={40} />
                        <div className="info">
                          <div className="title">
                            <span className="name" title={itemName}>
                              {itemName}
                            </span>
                            <span className="price">{getCurrency(item.default_price, currencySymbol)}</span>
                          </div>
                          <div className="sub" title={outletName}>
                            {outletName}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                {items.length > 0 && (
                  <div className="see-all" onClick={() => searchByKeyword(keyword, 'item')}>
                    {t('LABEL.SEE_ALL')}
                  </div>
                )}
              </div>
            )}
            {!noResult && restaurants && type === 'restaurant' && (
              <div className="suggestion-list">
                {restaurants.length === 0 && <EmptyResult showKeyword />}
                {restaurants.length > 0 &&
                  restaurants.slice(0, 5).map((restaurant, i) => {
                    const translation = restaurant.translations ? restaurant.translations.find((obj) => obj.lang_iso_code === lang) : null;
                    const restaurantName = (translation && translation.name) || restaurant.name || '';
                    return (
                      <div className="item" onClick={() => redirectUrl(restaurant.slug)} key={i}>
                        <BgImage src={restaurant.logo} width={40} height={40} />
                        <div className="info">
                          <div className="title" title={restaurantName}>
                            {restaurantName}
                          </div>
                          <div className="sub">{restaurant.address}</div>
                        </div>
                      </div>
                    );
                  })}
                {restaurants.length > 0 && (
                  <div className="see-all" onClick={() => searchByKeyword(keyword, 'restaurant')}>
                    {t('LABEL.SEE_ALL')}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
}

export default SuggestionMobile;
