import React from 'react';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import SuggestionDesktop from './components/SuggestionDesktop';
import SuggestionMobile from './components/SuggestionMobile';
import { getSuggestion } from 'services/search';
import { getParameterByName } from 'utils';
import { updateKeyword, updateKeywordVersion, updateSearchType } from 'store/actions/search';
import { history } from 'store';

import './css/style.scss';

@withTranslation('translations')
@connect(
  (state) => ({
    lang: state.config.lang,
    keyword: state.search.keyword,
    position: state.config.position,
    locationRouter: state.router.location
  }),
  {
    updateKeyword,
    updateKeywordVersion,
    updateSearchType
  }
)
class Suggestion extends React.Component {
  constructor(props) {
    super(props);
    //const keyword = getParameterByName('keyword');

    this.state = {
      keyword: '',
      items: null,
      restaurants: null,
      suggestionOpened: false
    };

    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.onKeyPress = this.onKeyPress.bind(this);
    this.openSuggestion = this.openSuggestion.bind(this);
    this.closeSuggestion = this.closeSuggestion.bind(this);
    this.onKeyPress = this.onKeyPress.bind(this);
    this.clearSuggestion = this.clearSuggestion.bind(this);
    this.searchByKeyword = this.searchByKeyword.bind(this);
    this.redirectUrl = this.redirectUrl.bind(this);
    this.timeout = null;
  }

  componentDidMount() {
    // Update keyword from url
    const keyword = getParameterByName('keyword');

    if (keyword) {
      this.props.updateKeyword(keyword);
      setTimeout(this.setState({keyword}), 3000);

    }
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentDidUpdate(prevProps, prevState) {
    // if (!this.state.suggestionOpened && this.state.suggestionOpened !== prevState.suggestionOpened) {
    //     this.inputRef.focus();
    // }

    if (
      (!this.props.keyword && this.props.keyword !== prevProps.keyword) ||
      (prevProps.locationRouter.pathname === '/search' && this.props.locationRouter.pathname !== prevProps.locationRouter.pathname)
    ) {
      this.setState({
        //keyword: '',
        items: null,
        restaurants: null,
        suggestionOpened: false
      });
      document.body.className = '';
    }
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  handleClickOutside(event) {
    if (!event.target) {
      return;
    }
    // Click outside close panel
    if (this.suggestionDesktopRef && !this.suggestionDesktopRef.contains(event.target) && this.suggestionMobileRef && !this.suggestionMobileRef.contains(event.target)) {
      this.setState({
        suggestionOpened: false
      });
      document.body.classList.remove('suggestion-open');
    }
  }

  openSuggestion() {
    const keyword = getParameterByName('keyword');
    const { position } = this.props;
    const { items, restaurants } = this.state;
    if (keyword && items === null && restaurants === null) {
      const params = {
        keyword
      };
      if (position) {
        if (position.latitude) {
          params.lat = position.latitude;
        }
        if (position.longitude) {
          params.lon = position.longitude;
        }
      }
      if (navigator) {
        params.userAgent = navigator.userAgent;
      }
      getSuggestion(params).then((res) => {
        if (res && !res.error) {
          this.setState({
            restaurants: res.dataRestaurant,
            items: res.dataItem,
            suggestionOpened: true
          });
        }
      });
    } else {
      !this.state.suggestionOpened &&
        this.setState({
          suggestionOpened: true
        });
    }
    document.body.classList.add('suggestion-open');
  }

  closeSuggestion() {
    this.state.suggestionOpened &&
      this.setState({
        suggestionOpened: false
      });

    document.body.classList.remove('suggestion-open');
  }

  redirectUrl(slug) {
    const { updateKeyword, updateSearchType } = this.props;
    history.push(`/${slug}`);
    this.setState({
      keyword: '',
      suggestionOpened: false,
      items: null,
      restaurants: null
    });
    updateKeyword('');
    updateSearchType('item');
    document.body.classList.remove('suggestion-open');
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
   this.setState({
      [name]: value
    });
    if (this.timeout) clearTimeout(this.timeout);
    const { position } = this.props;
    this.timeout = setTimeout(() => {
      // Update keyword
      this.props.updateKeyword(value);
      const params = {
        keyword: value
      };
      if (position) {
        if (position.latitude) {
          params.lat = position.latitude;
        }
        if (position.longitude) {
          params.lon = position.longitude;
        }
      }
      if (navigator) {
        params.userAgent = navigator.userAgent;
      }
      getSuggestion(params).then((res) => {
        if (res && !res.error) {
          this.setState({
            restaurants: res.dataRestaurant,
            items: res.dataItem,
            suggestionOpened: true
          });
          document.body.classList.add('suggestion-open');
        }
      });
    }, 500);
  }

  onKeyPress(event) {
    if (event.key === 'Enter') {
      const target = event.target;
      const value = target.value;
      this.searchByKeyword(value, 'item');
    }
  }

  searchByKeyword(value, type) {
    const { updateKeyword, updateKeywordVersion, updateSearchType } = this.props;
    const self = this;
    if (this.timeout) clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      self.setState({
        suggestionOpened: false
      });

      // Update keyword in store
      updateKeyword(value);
      // Update keyword version in store
      updateKeywordVersion();
      // Update search type in store
      updateSearchType(type);
      // Redirect to search page
      history.push({
        pathname: '/search',
        search: '?keyword=' + value
      });

      document.body.classList.remove('suggestion-open');
    }, 1);
  }

  clearSuggestion() {
    if (this.timeout) clearTimeout(this.timeout);
    const self = this;
    this.timeout = setTimeout(() => {
      self.setState({
        keyword: '',
        items: null,
        restaurants: null
      });
    }, 1);
  }

  render() {
    const { t, scrollHeight, className, hide } = this.props;
    let { keyword, items, restaurants, suggestionOpened } = this.state;
    const noResult = items && items.length === 0 && restaurants && restaurants.length === 0;
    if (this.props.handleSuggestion) this.props.handleSuggestion(this.state.suggestionOpened);
    /* if(keyword===''){
      keyword = this.props.keyword;
    } */

    return (
      <div className="suggestion" style={{ visibility: hide ? 'hidden' : 'visible', opacity: hide ? 0 : 1, transition: 'opacity 1s' }}>
        <div className={`d-md-block ${className ?? ''} ${keyword != '' ? ' ' : 'd-none '}`}>
          <input
            ref={(node) => (this.inputRef = node)}
            type="text"
            className={`search_location ${scrollHeight >= 210 ? 'border' : 'no-border '}`}
            placeholder={t('PLACEHOLDER.TYPE_YOUR_SEARCH')}
            value={keyword}
            name="keyword"
            autoComplete="off"
            onChange={this.handleInputChange}
            onClick={this.openSuggestion}
            onKeyPress={this.onKeyPress}
          />
          {
            <button type="button">
              <img src="/images/svg/search.svg" alt="search" />
            </button>
          }
          {keyword && (
            <div className="close-btn" onClick={this.clearSuggestion}>
              <i className="icon-hottab-x"></i>
            </div>
          )}
        </div>
        {keyword == '' && (
          <div className="d-md-none">
            <div className="btn-search-mobile" onClick={this.openSuggestion}>
              <i className="icon-hottab-magnify"></i>
            </div>
          </div>
        )}
        <div className="d-none d-lg-block" ref={(node) => (this.suggestionDesktopRef = node)}>
          <SuggestionDesktop
            items={items}
            restaurants={restaurants}
            keyword={keyword}
            suggestionOpened={suggestionOpened}
            noResult={noResult}
            closeSuggestion={this.closeSuggestion}
            redirectUrl={this.redirectUrl}
            searchByKeyword={this.searchByKeyword}
          />
        </div>
        <div className="d-lg-none" ref={(node) => (this.suggestionMobileRef = node)}>
          <SuggestionMobile
            items={items}
            restaurants={restaurants}
            keyword={keyword}
            suggestionOpened={suggestionOpened}
            noResult={noResult}
            closeSuggestion={this.closeSuggestion}
            redirectUrl={this.redirectUrl}
            searchByKeyword={this.searchByKeyword}
            handleInputChange={this.handleInputChange}
            onKeyPress={this.onKeyPress}
            clearSuggestion={this.clearSuggestion}
          />
        </div>
      </div>
    );
  }
}

export default Suggestion;
