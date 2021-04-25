(window.webpackJsonp=window.webpackJsonp||[]).push([[13],{1081:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.ModifierPropType=void 0;var r,o=n(3),a=(r=o)&&r.__esModule?r:{default:r};var i={localeUtils:a.default.shape({formatMonthTitle:a.default.func,formatWeekdayShort:a.default.func,formatWeekdayLong:a.default.func,getFirstDayOfWeek:a.default.func}),range:a.default.shape({from:a.default.instanceOf(Date),to:a.default.instanceOf(Date)}),after:a.default.shape({after:a.default.instanceOf(Date)}),before:a.default.shape({before:a.default.instanceOf(Date)})};t.ModifierPropType=a.default.oneOfType([i.after,i.before,i.range,a.default.func,a.default.array]);t.default=i},1082:function(e,t,n){},1083:function(e,t,n){},1090:function(e,t,n){"use strict";n.r(t);var r,o=n(0),m=n.n(o),a=n(7),i=n(9),y=n.n(i),s=n(6),h=n(22),b=n(58),c=n(843),l=n.n(c),u=n(137),d=n.n(u);n(303),n(1082);function f(e){return(f="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function p(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function v(e){return(v=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function g(e,t){return(g=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function E(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}var O,w=Object(a.connect)(function(e){return{lang:e.config.lang}})(r=function(e){function o(e){var t,n,r;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,o),n=this,(t=!(r=v(o).call(this,e))||"object"!==f(r)&&"function"!=typeof r?E(n):r).handleDayClick=t.handleDayClick.bind(E(E(t))),t.handleDayMouseEnter=t.handleDayMouseEnter.bind(E(E(t))),t.handleResetClick=t.handleResetClick.bind(E(E(t))),t.state=t.getInitialState(),t}var t,n,r;return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&g(e,t)}(o,m.a.Component),t=o,(n=[{key:"getInitialState",value:function(){return{from:this.props.from,to:this.props.to,enteredTo:this.props.enteredTo}}},{key:"isSelectingFirstDay",value:function(e,t,n){var r=e&&c.DateUtils.isDayBefore(n,e);return!e||r||e&&t}},{key:"handleDayClick",value:function(e){var t=this,n=this.state,r=n.from,o=n.to;r&&o&&r<=e&&e<=o?this.setState({from:e,to:null,enteredTo:null}):this.isSelectingFirstDay(r,o,e)?this.setState({from:e,to:null,enteredTo:null}):this.setState({to:e,enteredTo:e},function(){t.props.onSelectedRange(r,e,e)})}},{key:"handleDayMouseEnter",value:function(e){var t=this.state,n=t.from,r=t.to;this.isSelectingFirstDay(n,r,e)||this.setState({enteredTo:e})}},{key:"handleResetClick",value:function(){this.setState({from:null,to:null,enteredTo:null})}},{key:"render",value:function(){var e=this.state,t=e.from,n=e.enteredTo,r=this.props.lang,o={start:t,end:n},a=[t,{from:t,to:n}];return m.a.createElement("div",{className:"date-range-wrapper"},m.a.createElement(l.a,{className:"Range",locale:r,localeUtils:d.a,numberOfMonths:2,selectedDays:a,modifiers:o,onDayClick:this.handleDayClick,onDayMouseEnter:this.handleDayMouseEnter}))}}])&&p(t.prototype,n),r&&p(t,r),o}())||r,D=n(730),k=n(721),S=n(2),N=n(29),T=n(5);n(1083);function _(e){return(_="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function j(e){return function(e){if(Array.isArray(e)){for(var t=0,n=new Array(e.length);t<e.length;t++)n[t]=e[t];return n}}(e)||function(e){if(Symbol.iterator in Object(e)||"[object Arguments]"===Object.prototype.toString.call(e))return Array.from(e)}(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance")}()}function P(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function C(e){return(C=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function R(e,t){return(R=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function x(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}var M=Object(s.translate)("translations")(O=Object(a.connect)(function(e){return{isLoggedIn:e.auth.loggedIn,lang:e.config.lang,token:e.auth.token,orderHistory:e.order.history,historyVersion:e.order.historyVersion}},{saveOrderHistory:N.h,saveHistoryVersion:N.g})(O=function(e){function o(e){var t,n,r;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,o),n=this,(t=!(r=C(o).call(this,e))||"object"!==_(r)&&"function"!=typeof r?x(n):r).state={dateOpened:!1,from:y()(new Date).subtract(7,"days").toDate(),to:y()(new Date).toDate(),enteredTo:y()(new Date).toDate(),pageCursor:null},t.handleClickOutside=t.handleClickOutside.bind(x(x(t))),t.onSelectedRange=t.onSelectedRange.bind(x(x(t))),t.formatDate="DD/MM/YYYY",t.formatDateApi="YYYY-MM-DD 00:00:00",t.requestPending=!1,t}var t,n,r;return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&R(e,t)}(o,m.a.Component),t=o,(n=[{key:"componentDidMount",value:function(){document.addEventListener("mousedown",this.handleClickOutside);var e=this.state,t=e.from,n=e.to;this.props.isLoggedIn&&this.getOrders(t,n,!0)}},{key:"componentDidUpdate",value:function(e){if(this.props.historyVersion!==e.historyVersion&&document.body.scrollHeight<=window.outerHeight&&""!==this.state.pageCursor){var t=this.state,n=t.from,r=t.to;this.getOrders(n,r)}}},{key:"componentWillUnmount",value:function(){document.removeEventListener("mousedown",this.handleClickOutside)}},{key:"getOrders",value:function(e,t,n){var r=this;if(!this.requestPending){this.requestPending=!0;var o=this.props,a=o.token,i=o.saveOrderHistory,s=o.orderHistory,c=o.saveHistoryVersion,l=this.state.pageCursor,u={from:y()(e).format(this.formatDateApi),to:y()(t).format(this.formatDateApi),minutes_offset:S.L};l&&!n&&(u.page_cursor=l),Object(k.g)(u,a).then(function(e){if(r.requestPending=!1,e&&!e.error)if(r.setState({pageCursor:e.data.next_page_cursor}),e.data.orders){var t=s?n?j(e.data.orders):j(s).concat(j(e.data.orders)):j(e.data.orders);i(t),c()}else n&&i(null)})}}},{key:"handleClickOutside",value:function(e){e.target&&(!this.dateRangeRef||this.dateRangeRef.contains(e.target)||this.inputRef.contains(e.target)||this.setState({dateOpened:!1}))}},{key:"onFocusDate",value:function(){this.state.dateOpened||this.setState({dateOpened:!0})}},{key:"onKeyPress",value:function(e){e.preventDefault()}},{key:"onChangeInput",value:function(){return!1}},{key:"onSelectedRange",value:function(e,t,n){this.getOrders(e,t,!0),this.setState({from:e,to:t,enteredTo:n,dateOpened:!1})}},{key:"redirectOrderDetail",value:function(e,t){T.a.push("/order/".concat(t.order.uuid))}},{key:"redirectRestaurant",value:function(e,t){T.a.push(t),e.stopPropagation()}},{key:"render",value:function(){var u=this,e=this.props,t=e.t,n=e.isLoggedIn,d=e.lang,r=e.orderHistory;if(!n)return T.a.push("/"),null;if(null===r)return m.a.createElement(h.a,null);var o=this.state,a=o.from,i=o.to,s=o.enteredTo,c=o.dateOpened,l=o.pageCursor,f=y()(a).format(this.formatDate)+" - "+y()(i).format(this.formatDate),p=""!==l;return m.a.createElement("div",{className:"order-history"},m.a.createElement("div",{className:"container"},m.a.createElement("div",{className:"order-date-wrapper"},m.a.createElement("input",{className:"order-date-select",ref:function(e){return u.inputRef=e},type:"text",value:f,onChange:this.onChangeInput,onKeyPress:this.onKeyPress,onFocus:function(){return u.onFocusDate()}}),m.a.createElement("i",{className:"icon-hottab-calendar"}),m.a.createElement("div",{className:"date-range-panel ".concat(c?"":"d-none"),ref:function(e){return u.dateRangeRef=e}},m.a.createElement(w,{from:a,to:i,enteredTo:s,onSelectedRange:this.onSelectedRange}))),(void 0===r||r&&0===r.length)&&m.a.createElement(b.a,null),r&&0<r.length&&m.a.createElement("div",{className:"order-list"},m.a.createElement("div",{className:"header d-none d-md-block"},m.a.createElement("div",{className:"order-row row"},m.a.createElement("div",{className:"col status extra-padding-left"},t("TABLE.STATUS")),m.a.createElement("div",{className:"col type"},t("TABLE.TYPE")),m.a.createElement("div",{className:"col restaurant"},t("TABLE.RESTAURANT_NAME")),m.a.createElement("div",{className:"col date"},t("TABLE.DATE")),m.a.createElement("div",{className:"col amount text-right extra-padding-right"},t("TABLE.AMOUNT")),m.a.createElement("div",{className:"col-empty"}))),m.a.createElement("div",{className:"body"},m.a.createElement(D.a,{loadData:function(){return u.getOrders(a,i)},hasMore:p},r.map(function(t,n){var e=t.outlet.translations.find(function(e){return e.lang_iso_code===d}),r=e&&e.name||t.outlet.name||"",o=t.outlet.currency.symbol,a=y()(t.order.created_at).add(-S.L,"minutes").format("DD-MM-YYYY HH:mm"),i=Object(S.J)(t.outlet.name),s=Object(S.D)(t.order.status),c=t.payment.find(function(e){return 10===e.type}),l=c?c.amount:0;return m.a.createElement("div",{className:"order-row ".concat(n%2==0?"odd":"even"),onClick:function(e){return u.redirectOrderDetail(e,t,n)},key:n},m.a.createElement("div",{className:"row d-none d-md-flex"},m.a.createElement("div",{className:"col status extra-padding-left ".concat(t.order.status===S.a.PAID?"paid":""),ref:function(e){return u["statusRef".concat(n)]=e}},m.a.createElement("span",{className:"order-color ".concat(s)},Object(S.E)(t.order.status))),m.a.createElement("div",{className:"col type"},Object(S.y)(t.order.order_type)),m.a.createElement("div",{className:"col restaurant",title:r},r),m.a.createElement("div",{className:"col date"},a),m.a.createElement("div",{className:"col amount text-right text-bold extra-padding-right"},Object(S.s)(t.order.total-l,o)),m.a.createElement("div",{className:"col-empty"},m.a.createElement("i",{className:"icon-hottab-angle-right"}))),m.a.createElement("div",{className:"row-mobile d-md-none"},m.a.createElement("div",{className:"property-row restaurant"},m.a.createElement("span",{className:"restaurant-text",onClick:function(e){return u.redirectRestaurant(e,"/".concat(i,"?code=").concat(t.outlet.code))},title:r},r),m.a.createElement("span",{className:"amount text-right text-bold extra-padding-right"},Object(S.s)(t.order.total-l,o))),m.a.createElement("div",{className:"property-row"},t.order.order_type===S.b.DELIVERY&&m.a.createElement("i",{className:"icon-hottab-delivery"}),t.order.order_type===S.b.TAKE_AWAY&&m.a.createElement("i",{className:"icon-hottab-takeaway"}),m.a.createElement("div",{className:"type"},Object(S.y)(t.order.order_type)),m.a.createElement("div",{className:"status extra-padding-left"},m.a.createElement("span",{className:"order-color ".concat(s)},Object(S.E)(t.order.status)))),m.a.createElement("div",{className:"property-row date"},a)))}))))))}}])&&P(t.prototype,n),r&&P(t,r),o}())||O)||O;t.default=M},730:function(e,t,n){"use strict";var r=n(0),a=n.n(r);function i(e){return(i="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function s(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function c(e){return(c=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function l(e,t){return(l=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function u(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}var o=function(e){function o(e){var t,n,r;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,o),n=this,(t=!(r=c(o).call(this,e))||"object"!==i(r)&&"function"!=typeof r?u(n):r).scrollHandler=t.scrollHandler.bind(u(u(t))),t}var t,n,r;return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&l(e,t)}(o,a.a.Component),t=o,(n=[{key:"componentDidMount",value:function(){window.addEventListener("scroll",this.scrollHandler)}},{key:"componentWillUnmount",value:function(){window.removeEventListener("scroll",this.scrollHandler)}},{key:"scrollHandler",value:function(){var e=document.body,t=document.documentElement,n=window.pageYOffset||document.documentElement.scrollTop;Math.max(e.scrollHeight,e.offsetHeight,t.clientHeight,t.scrollHeight,t.offsetHeight)-(window.innerHeight||document.documentElement.clientHeight||document.body.clientHeight)-300<=n&&this.props.hasMore&&this.props.loadData()}},{key:"render",value:function(){return a.a.createElement(a.a.Fragment,null,this.props.children)}}])&&s(t.prototype,n),r&&s(t,r),o}();t.a=o},843:function(e,t,n){var r=n(305),o=n(81),a=n(144),i=n(145),s=n(307),c=n(306),l=n(1081);e.exports=r,e.exports.DateUtils=o,e.exports.LocaleUtils=a,e.exports.ModifiersUtils=i,e.exports.WeekdayPropTypes=s.propTypes,e.exports.NavbarPropTypes=c.propTypes,e.exports.PropTypes=l}}]);