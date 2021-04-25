(window.webpackJsonp = window.webpackJsonp || []).push([
  [20],
  {
    1079: function (e, t, a) {},
    1099: function (e, t, a) {
      'use strict';
      a.r(t);
      var n,
        l = a(0),
        r = a.n(l),
        c = a(8),
        o = a(6),
        i = a(714);
      a(1079);
      function u(e) {
        return (u =
          'function' == typeof Symbol && 'symbol' == typeof Symbol.iterator
            ? function (e) {
                return typeof e;
              }
            : function (e) {
                return e && 'function' == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? 'symbol' : typeof e;
              })(e);
      }
      function m(e, t) {
        for (var a = 0; a < t.length; a++) {
          var n = t[a];
          (n.enumerable = n.enumerable || !1), (n.configurable = !0), 'value' in n && (n.writable = !0), Object.defineProperty(e, n.key, n);
        }
      }
      function s(e, t) {
        return !t || ('object' !== u(t) && 'function' != typeof t)
          ? (function (e) {
              if (void 0 !== e) return e;
              throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            })(e)
          : t;
      }
      function E(e) {
        return (E = Object.setPrototypeOf
          ? Object.getPrototypeOf
          : function (e) {
              return e.__proto__ || Object.getPrototypeOf(e);
            })(e);
      }
      function p(e, t) {
        return (p =
          Object.setPrototypeOf ||
          function (e, t) {
            return (e.__proto__ = t), e;
          })(e, t);
      }
      var f =
        Object(o.translate)('translations')(
          (n = (function (e) {
            function t() {
              return (
                (function (e, t) {
                  if (!(e instanceof t)) throw new TypeError('Cannot call a class as a function');
                })(this, t),
                s(this, E(t).apply(this, arguments))
              );
            }
            var a, n, l;
            return (
              (function (e, t) {
                if ('function' != typeof t && null !== t) throw new TypeError('Super expression must either be null or a function');
                (e.prototype = Object.create(t && t.prototype, { constructor: { value: e, writable: !0, configurable: !0 } })), t && p(e, t);
              })(t, r.a.Component),
              (a = t),
              (n = [
                {
                  key: 'render',
                  value: function () {
                    var e = this.props.t;
                    return r.a.createElement(
                      'div',
                      { className: 'plain-text-page aboutus' },
                      r.a.createElement(i.a, null),
                      r.a.createElement(
                        'div',
                        { className: 'container normal' },
                        r.a.createElement(
                          'div',
                          { className: 'row' },
                          r.a.createElement(
                            'div',
                            { className: 'breadcrumb' },
                            r.a.createElement(c.Link, { to: '/' }, e('LINK.HOME')),
                            '»',
                            r.a.createElement('span', null, e('LINK.FOOTER.ABOUT_US'))
                          )
                        ),
                        r.a.createElement(
                          'div',
                          { className: 'row address1' },
                          r.a.createElement(
                            'div',
                            { className: 'col-md-9' },
                            r.a.createElement(
                              'div',
                              { className: 'main-content' },
                              r.a.createElement('h2', null, e('LINK.FOOTER.ABOUT_US')),
                              r.a.createElement('h3', null, e('PLAIN_TEXT.ABOUT.Para1')),
                              r.a.createElement('p', null),
                              r.a.createElement('p', null, e('PLAIN_TEXT.ABOUT.Para2')),
                              r.a.createElement('p', null, e('PLAIN_TEXT.ABOUT.Para4')),
                              r.a.createElement('p', null, e('PLAIN_TEXT.ABOUT.Para5')),
                              r.a.createElement('p', null, e('PLAIN_TEXT.ABOUT.Para6')),
                              r.a.createElement(
                                'div',
                                { className: 'contact' },
                                r.a.createElement(
                                  'p',
                                  null,
                                  r.a.createElement('i', { className: 'icon-hottab-phone', 'aria-hidden': 'true' }),
                                  ' ',
                                  r.a.createElement('a', { href: 'tel:+84 9424268822' }, '+84 9424268822')
                                ),
                                r.a.createElement(
                                  'p',
                                  null,
                                  r.a.createElement('i', { className: 'icon-hottab-email', 'aria-hidden': 'true' }),
                                  ' ',
                                  r.a.createElement('a', { href: 'mailto:hello@hottab.net' }, 'hello@hottab.net')
                                ),
                                r.a.createElement(
                                  'p',
                                  null,
                                  r.a.createElement('i', { className: 'icon-hottab-gps', 'aria-hidden': 'true' }),
                                  ' Floor 6, 57 Tran Quoc Toan',
                                  r.a.createElement('br', null),
                                  ' Tran Hung Dao Ward, Hoan Kiem District, Hanoi, Vietnam'
                                )
                              )
                            ),
                            r.a.createElement(
                              'div',
                              { className: 'main-content' },
                              r.a.createElement('h3', null, 'SoPa Singapore:'),
                              r.a.createElement('p', null),
                              r.a.createElement(
                                'p',
                                null,
                                'SoPa Technology Pte. Ltd.',
                                r.a.createElement('br', null),
                                '459 Tagore Industrial Avenue #04-09',
                                r.a.createElement('br', null),
                                'Singapore',
                                r.a.createElement('br', null),
                                '787828'
                              )
                            ),
                            r.a.createElement(
                              'div',
                              { className: 'main-content' },
                              r.a.createElement('h3', null, 'SoPa Vietnam:'),
                              r.a.createElement('p', null),
                              r.a.createElement(
                                'p',
                                null,
                                'SoPa Technology Co. Ltd.',
                                r.a.createElement('br', null),
                                'SBI Building, Quang Trung Software Park',
                                r.a.createElement('br', null),
                                'Tan Chanh Hiep Ward, District 12, Ho Chi Minh City, Vietnam',
                                r.a.createElement('br', null)
                              )
                            ),
                            r.a.createElement(
                              'div',
                              { className: 'main-content' },
                              r.a.createElement('h3', null, 'SoPa India:'),
                              r.a.createElement('p', null),
                              r.a.createElement(
                                'p',
                                null,
                                'SoPa Cognitive Analytics Private Limited',
                                r.a.createElement('br', null),
                                '612, B Block, Noida One Building',
                                r.a.createElement('br', null),
                                'Sector-62, Noida',
                                r.a.createElement('br', null),
                                ' 201301'
                              )
                            )
                          ),
                          r.a.createElement(
                            'div',
                            { className: 'sidebar col-md-3' },
                            r.a.createElement(
                              'ul',
                              null,
                              r.a.createElement('li', { className: 'active' }, r.a.createElement('span', null, e('LINK.FOOTER.ABOUT_US'))),
                              r.a.createElement('li', null, r.a.createElement(c.Link, { to: '/why-hottab' }, e('LINK.FOOTER.WHY_HOTTAB'))),
                              r.a.createElement('li', null, r.a.createElement(c.Link, { to: '/terms-conditions' }, e('LINK.FOOTER.TERM_AND_CONDITIONS'))),
                              r.a.createElement('li', null, r.a.createElement(c.Link, { to: '/privacy' }, e('LINK.FOOTER.PRIVACY_POLICY')))
                            )
                          )
                        )
                      )
                    );
                  }
                }
              ]) && m(a.prototype, n),
              l && m(a, l),
              t
            );
          })())
        ) || n;
      t.default = f;
    },
    714: function (e, t, a) {
      'use strict';
      var n = a(0),
        l = a.n(n),
        r = a(718);
      t.a = function () {
        return l.a.createElement(r.Helmet, null, l.a.createElement('title', null, '#SOPA: Online order and Marketing Platform'));
      };
    }
  }
]);
