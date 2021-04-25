import React from 'react';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';

import EmptyResult from 'components/EmptyResult';
import BgImage from 'components/BgImage';
import { getCurrency } from 'utils';

@withTranslation('translations')
@connect(
  (state) => ({
    lang: state.config.lang
  }),
  null
)
class SuggestionDesktop extends React.Component {
  render() {
    const { t, lang, keyword, suggestionOpened, searchByKeyword, redirectUrl, noResult, items, restaurants } = this.props;
    return (
      <div>
        {items && restaurants && keyword && suggestionOpened && (
          <div className={`suggestion-desktop suggestion-dropdown row ${noResult ? 'no-result' : ''}`} ref={(node) => (this.suggestionRef = node)}>
            {noResult && <EmptyResult showKeyword />}
            {!noResult && (
              <div className="col-6 suggestion-list item-list">
                <h3>{t('LABEL.SEARCH_ITEMS')}</h3>
                {items.length === 0 && <EmptyResult showKeyword />}
                {items.length > 0 &&
                  items.slice(0, 6).map((item, i) => {
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
            {!noResult && (
              <div className="col-6 suggestion-list">
                <h3>{t('LABEL.PLACES')}</h3>
                {restaurants.length === 0 && <EmptyResult showKeyword />}
                {restaurants.length > 0 &&
                  restaurants.slice(0, 6).map((restaurant, i) => {
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

export default SuggestionDesktop;
