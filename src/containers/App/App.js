import React from 'react';
import {connect} from 'react-redux';
import {Route, Switch} from 'react-router-dom';
import {ConnectedRouter} from 'connected-react-router';
import {ToastContainer} from 'react-toastify';
import moment from 'moment';
import is from 'is_js';
import Header from 'components/Header';
import Footer from 'components/Footer';
import {history} from 'store';
import i18n from 'i18n';
import Home from 'containers/Home';

import 'swiper/dist/css/swiper.min.css';
import 'react-toastify/dist/ReactToastify.min.css';
import 'containers/App/css/common.scss';
import 'url-search-params-polyfill';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        return (<ConnectedRouter history={history}>
            <React.Fragment>
                <Header/>
                <Switch>
                    <Route exact path="/"
                        component={Home}/>

                </Switch>
                <Footer/>
                <ToastContainer pauseOnFocusLoss={false}/>
            </React.Fragment>
        </ConnectedRouter>);
    }
}

export default App;
