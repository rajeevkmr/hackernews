(window.webpackJsonp=window.webpackJsonp||[]).push([[16],{1084:function(e,t,n){},1085:function(e,t,n){},1089:function(e,t,n){"use strict";n.r(t);var r,o=n(0),S=n.n(o),a=n(7),c=n(6),i=n(22),j=n(8),u=n(9),C=n.n(u),l=n(34),k=n(19),N=n(213),L=n(2),s=n(5),f=n(725);n(1084);function h(e){return(h="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function m(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function p(e){return(p=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function v(e,t){return(v=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function b(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}var d,y=Object(c.translate)("translations")(r=Object(a.connect)(function(e){return{lang:e.config.lang,token:e.auth.token}},null)(r=function(e){function o(e){var t,n,r;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,o),n=this,(t=!(r=p(o).call(this,e))||"object"!==h(r)&&"function"!=typeof r?b(n):r).state={detailOpened:!1,quantity:1,convertOpened:!1},t.handleClickOutside=t.handleClickOutside.bind(b(b(t))),t.toggleDetail=t.toggleDetail.bind(b(b(t))),t.toggleConvert=t.toggleConvert.bind(b(b(t))),t.converting=!1,t}var t,n,r;return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&v(e,t)}(o,S.a.Component),t=o,(n=[{key:"componentDidMount",value:function(){document.addEventListener("mousedown",this.handleClickOutside)}},{key:"handleClickOutside",value:function(e){e.target&&(!this.detailRef||this.detailRef.contains(e.target)||this.btnDetailRef.contains(e.target)||this.setState({detailOpened:!1}),!this.convertRef||this.convertRef.contains(e.target)||this.btnConvertRef.contains(e.target)||this.setState({convertOpened:!1}))}},{key:"toggleDetail",value:function(e){this.actionsRef&&this.actionsRef.contains(e.target)||this.setState({detailOpened:!this.state.detailOpened})}},{key:"toggleConvert",value:function(e){this.checkBtnConvertStatus(e)&&this.setState({convertOpened:!this.state.convertOpened})}},{key:"onClickButtonUse",value:function(e){var t=this.props.selectVoucher;t?t(e):e.outlet&&e.outlet.slug&&s.a.push("/".concat(e.outlet.slug))}},{key:"checkBtnConvertStatus",value:function(e){return 0<e.convertible_amount}},{key:"convertVoucher",value:function(e){var t=this;if(!this.converting&&(this.converting=!0,this.checkBtnConvertStatus(e))){var n=this.props,r=n.token,o=n.t,a=n.getCustomerVouchers,c=n.status,i={number_of_vouchers:this.state.quantity};Object(f.b)(e.voucher_uuid,i,r).then(function(e){t.converting=!1,e&&!e.error&&(a(c,1,!0),l.toast.info(o("TOAST.ConvertVoucherSuccessfully")))}).catch(function(e){l.toast.error(Object(L.n)(e.message)),t.converting=!1})}}},{key:"changeQuantity",value:function(e){var t=this.state.quantity;if(e){if(1===t)return;this.setState({quantity:t-1})}else this.setState({quantity:t+1})}},{key:"render",value:function(){var t=this,e=this.props,n=e.t,r=e.voucher,o=e.status,a=e.lang,c=this.state,i=c.detailOpened,u=c.convertOpened,l=c.quantity,s=Object(L.s)(r.amount,r.currency.symbol),f=C()(r.expires_at).format("DD/MM/YYYY"),h=r.outlet.translations?r.outlet.translations.find(function(e){return e.lang_iso_code===a}):null,m=h&&h.name||r.outlet.name||"",p=r.outlet.logo,v=window.location.protocol+"//"+window.location.hostname+"/voucher/claim?code="+r.voucher_code,b=0;b=2===r.type?r.setting.max_shared_percent_voucher:r.setting.max_rewarded_percent_voucher;var d=n("LABEL.VOUCHER_INFO_1").replace("%@",b),y=n("LABEL.VOUCHER_INFO_2").replace("%@",r.voucher_setting.share_limit-r.share_count),g=n("LABEL.VOUCHER_INFO_3"),E=r.share_count/r.voucher_setting.share_limit*100,O=r.amount*r.setting.new_voucher_on_sharing_percent/100*r.voucher_setting.share_limit,_=this.checkBtnConvertStatus(r),w=r.share_count===r.voucher_setting.share_limit;return S.a.createElement("div",{className:"voucher-item col-12 col-md-6 col-lg-4 clearfix ".concat(i?"detail-opened":"")},2===r.type&&S.a.createElement("i",{className:"icon-hottab-people icon-sharing","aria-hidden":"true"}),S.a.createElement("div",{className:"voucher-content"},S.a.createElement("div",{className:"voucher-info-wrapper"},S.a.createElement("div",{className:"voucher-info"},S.a.createElement("div",{className:"voucher-price"},s),S.a.createElement("div",{className:"restaurant-name",title:m},S.a.createElement(j.Link,{to:"/".concat(r.outlet.slug)},m)),S.a.createElement("div",{className:"voucher-expire"},n("LABEL.EXPIRE"),": ",f)),S.a.createElement("div",{className:"img-wrapper"},S.a.createElement(j.Link,{to:"/".concat(r.outlet.slug)},S.a.createElement(k.a,{src:p,width:80,height:80})))),S.a.createElement("div",{className:"voucher-detail-wrapper"},S.a.createElement("div",{className:"btn-detail",onClick:this.toggleDetail,ref:function(e){return t.btnDetailRef=e}},S.a.createElement("i",{className:"icon-hottab-help"}),n("LABEL.DETAILS")),S.a.createElement("div",{className:"voucher-detail",ref:function(e){return t.detailRef=e}},S.a.createElement("ol",null,S.a.createElement("li",null,d),r.is_shareable&&S.a.createElement("li",null,y),S.a.createElement("li",null,g)))),r.is_shareable&&S.a.createElement("div",{className:"voucher-earned"},S.a.createElement("div",{className:"earned-row"},r.setting.new_voucher_on_sharing_enabled&&S.a.createElement("div",{className:"earned-text"},S.a.createElement("span",null,Object(L.s)(r.convertible_amount,r.currency.symbol))," ",n("LABEL.EARNED")),S.a.createElement("div",{className:"share-number"},"".concat(r.share_count,"/").concat(r.voucher_setting.share_limit," ").concat(n("LABEL.SHARES")))),S.a.createElement("div",{className:"earned-bar"},S.a.createElement("div",{className:"active-bar",style:{width:"".concat(E,"%")}})),!w&&S.a.createElement("div",{className:"extra-info"},r.setting.new_voucher_on_sharing_enabled&&S.a.createElement("p",null,n("LABEL.VOUCHER_DETAIL_MSG1")," ",Object(L.s)(O,r.currency.symbol)),r.is_shareable&&S.a.createElement("p",null,y),S.a.createElement("p",null,n("LABEL.VOUCHER_DETAIL_MSG2"))),S.a.createElement("div",{className:"voucher-actions clearfix",ref:function(e){return t.actionsRef=e}},(!o||"past"!==o)&&r.is_shareable&&!w&&S.a.createElement(N.a,{name:m,url:v}),!(w&&0===r.convertible_amount)&&S.a.createElement("div",{className:"convert-wrapper"},S.a.createElement("button",{ref:function(e){return t.btnConvertRef=e},disabled:!_,className:"btn btn-convert-toggle ".concat(u?"opened":""),onClick:function(){return t.toggleConvert(r)}},S.a.createElement("i",{className:"icon-hottab-voucher"}),n("BUTTON.CONVERT_VOUCHER")),u&&S.a.createElement("div",{className:"convert-detail",ref:function(e){return t.convertRef=e}},S.a.createElement("p",null,n("LABEL.VOUCHER_CONVERT_LABEL")),S.a.createElement("p",null,n("LABEL.AMOUNT"),": ",S.a.createElement("span",null,Object(L.s)(r.convertible_amount,r.currency.symbol))),S.a.createElement("div",{className:"quantity-wrapper clearfix"},S.a.createElement("span",{className:"btn-quantity btn-minus",onClick:function(){return t.changeQuantity(!0)}}),S.a.createElement("span",{className:"quantity-text"},l),S.a.createElement("span",{className:"btn-quantity btn-plus",onClick:function(){return t.changeQuantity()}})),S.a.createElement("button",{className:"btn btn-type-2 btn-convert",onClick:function(){return t.convertVoucher(r)}},n("BUTTON.CONVERT"))))))))}}])&&m(t.prototype,n),r&&m(t,r),o}())||r)||r;function g(e){return(g="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function E(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function O(e,t){return!t||"object"!==g(t)&&"function"!=typeof t?function(e){if(void 0!==e)return e;throw new ReferenceError("this hasn't been initialised - super() hasn't been called")}(e):t}function _(e){return(_=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function w(e,t){return(w=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}var R,P=Object(c.translate)("translations")(d=function(e){function t(){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),O(this,_(t).apply(this,arguments))}var n,r,o;return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&w(e,t)}(t,S.a.Component),n=t,(r=[{key:"render",value:function(){var e=this.props,t=e.t,n=e.status,r=e.changeStatus;return S.a.createElement("div",{className:"voucher-filter"},S.a.createElement("select",{value:n,onChange:function(e){return r(e)}},S.a.createElement("option",{value:"available"},t("LABEL.NEW")),S.a.createElement("option",{value:"past"},t("LABEL.PAST"))))}}])&&E(n.prototype,r),o&&E(n,o),t}())||d,A=n(58),T=n(730);n(1085);function V(e){return(V="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function H(e){return function(e){if(Array.isArray(e)){for(var t=0,n=new Array(e.length);t<e.length;t++)n[t]=e[t];return n}}(e)||function(e){if(Symbol.iterator in Object(e)||"[object Arguments]"===Object.prototype.toString.call(e))return Array.from(e)}(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance")}()}function B(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function D(e){return(D=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function M(e,t){return(M=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function U(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}var x=Object(c.translate)("translations")(R=Object(a.connect)(function(e){return{isLoggedIn:e.auth.loggedIn,lang:e.config.lang,token:e.auth.token,orderHistory:e.order.history}},null)(R=function(e){function o(e){var t,n,r;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,o),n=this,(t=!(r=D(o).call(this,e))||"object"!==V(r)&&"function"!=typeof r?U(n):r).state={vouchers:null,hasMore:!0,page:1,status:"available"},t.changeStatus=t.changeStatus.bind(U(U(t))),t.getCustomerVouchers=t.getCustomerVouchers.bind(U(U(t))),t.requestPending=!1,t}var t,n,r;return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&M(e,t)}(o,S.a.Component),t=o,(n=[{key:"componentDidMount",value:function(){var e=this.state,t=e.status,n=e.page;this.getCustomerVouchers(t,n,!0)}},{key:"getCustomerVouchers",value:function(e,n,r){var o=this;if(!this.requestPending){this.requestPending=!0;var t=this.props.token,a=this.state.vouchers;Object(f.e)(e,n,t).then(function(e){if(e&&e.data){var t=a?r?H(e.data):H(a).concat(H(e.data)):H(e.data);o.setState({vouchers:t,page:n+1,hasMore:e.current_page<e.last_page})}o.requestPending=!1})}}},{key:"changeStatus",value:function(e){this.getCustomerVouchers(e.target.value,1,!0),this.setState({status:e.target.value})}},{key:"render",value:function(){var t=this,e=this.props.t,n=this.state,r=n.vouchers,o=n.status,a=n.page,c=n.hasMore;return r?0===r.length?S.a.createElement("div",{className:"customer-voucher"},S.a.createElement("div",{className:"container"},S.a.createElement("h2",null,e("LABEL.VOUCHER_MSG1")),S.a.createElement("p",null,e("LABEL.VOUCHER_MSG2")),S.a.createElement(P,{status:o,changeStatus:this.changeStatus}),S.a.createElement(A.a,null))):S.a.createElement("div",{className:"customer-voucher"},S.a.createElement("div",{className:"container"},S.a.createElement("h2",null,e("LABEL.VOUCHER_MSG1")),S.a.createElement("p",null,e("LABEL.VOUCHER_MSG2")),S.a.createElement(P,{status:o,changeStatus:this.changeStatus}),S.a.createElement(T.a,{loadData:function(){return t.getCustomerVouchers(o,a)},hasMore:c},S.a.createElement("div",{className:"vouchers-container row"},r.map(function(e){return S.a.createElement(y,{status:o,voucher:e,getCustomerVouchers:t.getCustomerVouchers,key:e.voucher_uuid})}))))):S.a.createElement(i.a,null)}}])&&B(t.prototype,n),r&&B(t,r),o}())||R)||R;t.default=x},725:function(e,t,n){"use strict";n.d(t,"c",function(){return o}),n.d(t,"f",function(){return a}),n.d(t,"d",function(){return c}),n.d(t,"e",function(){return i}),n.d(t,"g",function(){return u}),n.d(t,"a",function(){return l}),n.d(t,"b",function(){return s});var r=n(10);var o=function(e,t){return Object(r.b)("/orders",e,"POST",t,"order")},a=function(e,t){return Object(r.a)("/orders",{order_uuid:e},t,"order")},c=function(e,t){return Object(r.a)("/customer/vouchers/available",{outlet_uuid:e},t)},i=function(e,t,n){return Object(r.a)("/customer/vouchers",{status:e,page:t},n)},u=function(e){return Object(r.a)("/customer/vouchers/".concat(e))},l=function(e,t){return Object(r.b)("/customer/vouchers/".concat(e,"/claim"),null,"POST",t)},s=function(e,t,n){return Object(r.b)("/customer/vouchers/".concat(e,"/convert"),function(o){for(var e=1;e<arguments.length;e++){var a=null!=arguments[e]?arguments[e]:{},t=Object.keys(a);"function"==typeof Object.getOwnPropertySymbols&&(t=t.concat(Object.getOwnPropertySymbols(a).filter(function(e){return Object.getOwnPropertyDescriptor(a,e).enumerable}))),t.forEach(function(e){var t,n,r;t=o,r=a[n=e],n in t?Object.defineProperty(t,n,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[n]=r})}return o}({},t),"POST",n)}},730:function(e,t,n){"use strict";var r=n(0),a=n.n(r);function c(e){return(c="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function i(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function u(e){return(u=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function l(e,t){return(l=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function s(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}var o=function(e){function o(e){var t,n,r;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,o),n=this,(t=!(r=u(o).call(this,e))||"object"!==c(r)&&"function"!=typeof r?s(n):r).scrollHandler=t.scrollHandler.bind(s(s(t))),t}var t,n,r;return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&l(e,t)}(o,a.a.Component),t=o,(n=[{key:"componentDidMount",value:function(){window.addEventListener("scroll",this.scrollHandler)}},{key:"componentWillUnmount",value:function(){window.removeEventListener("scroll",this.scrollHandler)}},{key:"scrollHandler",value:function(){var e=document.body,t=document.documentElement,n=window.pageYOffset||document.documentElement.scrollTop;Math.max(e.scrollHeight,e.offsetHeight,t.clientHeight,t.scrollHeight,t.offsetHeight)-(window.innerHeight||document.documentElement.clientHeight||document.body.clientHeight)-300<=n&&this.props.hasMore&&this.props.loadData()}},{key:"render",value:function(){return a.a.createElement(a.a.Fragment,null,this.props.children)}}])&&i(t.prototype,n),r&&i(t,r),o}();t.a=o}}]);