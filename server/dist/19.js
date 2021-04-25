(window.webpackJsonp=window.webpackJsonp||[]).push([[19],{1059:function(e,t,n){},1092:function(e,t,n){"use strict";n.r(t);var r,a=n(0),b=n.n(a),o=n(6),c=n(7),i=n(9),O=n.n(i),_=n(8),u=n(34),E=n(210),y=n(58),R=n(19),j=n(714),s=n(725),S=n(2),f=n(5);n(1059);function l(e){return(l="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function m(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function h(e){return(h=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function d(e,t){return(d=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function p(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}var g=Object(o.translate)("translations")(r=Object(c.connect)(function(e){return{lang:e.config.lang,isLoggedIn:e.auth.loggedIn,token:e.auth.token,locationRouter:e.router.location}},null)(r=function(e){function a(e){var t,n,r;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,a),n=this,(t=!(r=h(a).call(this,e))||"object"!==l(r)&&"function"!=typeof r?p(n):r).state={voucher:null,detailOpened:!1},t.handleClickOutside=t.handleClickOutside.bind(p(p(t))),t.claimed=!1,t}var t,n,r;return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&d(e,t)}(a,b.a.Component),t=a,(n=[{key:"componentDidMount",value:function(){this.getVoucherDetail()}},{key:"componentDidUpdate",value:function(e){this.props.lang!==e.lang&&this.getVoucherDetail()}},{key:"getVoucherDetail",value:function(){var t=this,e=this.props.locationRouter,n=new URLSearchParams(e.search).get("code");n&&Object(s.g)(n).then(function(e){e&&!e.error&&(e.data?t.setState({voucher:e.data}):t.setState({voucher:{}}))})}},{key:"claimVoucher",value:function(o){if(!this.claimed){this.claimed=!0;var e=this.props,t=e.token,c=e.t,n=e.isLoggedIn,i=e.lang,r=o.voucher_uuid;if(!n)return this.loginModal&&this.loginModal.toggleModal(),void(this.claimed=!1);var l=this;Object(s.a)(r,t).then(function(e){if(e&&!e.error){f.a.push("/customer/voucher");var t=o.currency.symbol,n=Object(S.s)(o.amount,t),r=o.outlet.translations?o.outlet.translations.find(function(e){return e.lang_iso_code===i}):null,a=r&&r.name||o.outlet.name||"";u.toast.info(Object(S.o)(c("TOAST.ClaimVoucherSuccessfully"),n,a))}l.claimed=!1}).catch(function(e){if(e.message&&e.message.general&&e.message.general.code){var t=c("ERROR_CUSTOM_CODE.".concat(e.message.general.code));"voucher_reached_share_limit_rule_error"===e.message.general.code&&(t=c("ERROR_CUSTOM_CODE.".concat(e.message.general.code)).replace("%@",o.voucher_setting.share_limit),1===o.voucher_setting.share_limit&&(t=t.replace("persons","person"))),u.toast.error(t,"danger")}l.claimed=!1})}}},{key:"handleClickOutside",value:function(e){this.itemRef&&e.target&&e.target.parentElement&&(!this.itemRef||this.itemRef.contains(e.target)||this.itemRef.contains(e.target.nextElementSibling)||this.itemRef.contains(e.target.parentElement.nextElementSibling)||this.setState({detailOpened:!1}))}},{key:"toggleDetail",value:function(e){this.actionsRef&&this.actionsRef.contains(e.target)||this.nameRef&&this.nameRef.contains(e.target)||this.setState({detailOpened:!this.state.detailOpened})}},{key:"render",value:function(){var t=this,e=this.state.voucher;if(!e)return null;if(!e.voucher_uuid||!e.is_shareable)return b.a.createElement(y.a,null);var n=this.props,r=n.t,a=n.lang,o=e.currency.symbol,c=e.outlet.translations?e.outlet.translations.find(function(e){return e.lang_iso_code===a}):null,i=c&&c.name||e.outlet.name||"",l=e.outlet.logo,u=e.outlet.slug?"/".concat(e.outlet.slug):"",s=Object(S.s)(e.amount,o),f=s.replace(o,""),m=O()(e.expires_at).format("DD/MM/YYYY"),h=0;h=2===e.type?e.setting.max_shared_percent_voucher:e.setting.max_rewarded_percent_voucher;var d=r("LABEL.VOUCHER_CLAIM_1").replace("%@",s).replace("%#",i),p=r("LABEL.VOUCHER_INFO_1").replace("%@",h),g=r("LABEL.VOUCHER_INFO_2").replace("%@",e.voucher_setting.share_limit-e.share_count),v=r("LABEL.VOUCHER_INFO_3");return b.a.createElement("div",{className:"claim-voucher"},b.a.createElement(j.a,null),b.a.createElement("div",{className:"container"},b.a.createElement("div",{className:"content"},b.a.createElement("p",{className:"claim-message",dangerouslySetInnerHTML:{__html:d}}),b.a.createElement("p",null,r("LABEL.VOUCHER_CLAIM_2")),b.a.createElement("div",{className:"voucher-item clearfix ".concat(this.state.detailOpened?"detail-opened":""),onClick:function(e){return t.toggleDetail(e)},ref:function(e){return t.itemRef=e}},b.a.createElement("div",{className:"restaurant-name",ref:function(e){return t.nameRef=e}},b.a.createElement(_.Link,{to:u},i)),b.a.createElement("div",{className:"voucher-content"},b.a.createElement("div",{className:"img-wrapper"},b.a.createElement(R.a,{src:l,width:60,height:60})),b.a.createElement("div",{className:"voucher-info"},b.a.createElement("div",{className:"voucher-price"},f),b.a.createElement("div",{className:"voucher-expire"},r("LABEL.EXPIRE"),": ",m))),b.a.createElement("div",{className:"voucher-actions",ref:function(e){return t.actionsRef=e}},b.a.createElement("button",{className:"btn",onClick:function(){return t.claimVoucher(e)}},r("BUTTON.CLAIM"))),b.a.createElement("div",{className:"voucher-detail"},b.a.createElement("p",null,"1. ",p),b.a.createElement("p",null,"2. ",g),b.a.createElement("p",null,"3. ",v))))),b.a.createElement(E.a,{className:"login-modal",onItemRef:function(e){return t.loginModal=e}}))}}])&&m(t.prototype,n),r&&m(t,r),a}())||r)||r;t.default=g},714:function(e,t,n){"use strict";var r=n(0),a=n.n(r),o=n(718);t.a=function(){return a.a.createElement(o.Helmet,null,a.a.createElement("title",null,"#SOPA: Online order and Marketing Platform"))}},725:function(e,t,n){"use strict";n.d(t,"c",function(){return a}),n.d(t,"f",function(){return o}),n.d(t,"d",function(){return c}),n.d(t,"e",function(){return i}),n.d(t,"g",function(){return l}),n.d(t,"a",function(){return u}),n.d(t,"b",function(){return s});var r=n(10);var a=function(e,t){return Object(r.b)("/orders",e,"POST",t,"order")},o=function(e,t){return Object(r.a)("/orders",{order_uuid:e},t,"order")},c=function(e,t){return Object(r.a)("/customer/vouchers/available",{outlet_uuid:e},t)},i=function(e,t,n){return Object(r.a)("/customer/vouchers",{status:e,page:t},n)},l=function(e){return Object(r.a)("/customer/vouchers/".concat(e))},u=function(e,t){return Object(r.b)("/customer/vouchers/".concat(e,"/claim"),null,"POST",t)},s=function(e,t,n){return Object(r.b)("/customer/vouchers/".concat(e,"/convert"),function(a){for(var e=1;e<arguments.length;e++){var o=null!=arguments[e]?arguments[e]:{},t=Object.keys(o);"function"==typeof Object.getOwnPropertySymbols&&(t=t.concat(Object.getOwnPropertySymbols(o).filter(function(e){return Object.getOwnPropertyDescriptor(o,e).enumerable}))),t.forEach(function(e){var t,n,r;t=a,r=o[n=e],n in t?Object.defineProperty(t,n,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[n]=r})}return a}({},t),"POST",n)}}}]);