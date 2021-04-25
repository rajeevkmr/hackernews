var cfenv = require("cfenv");
var bodyParser = require('body-parser')

const express = require('express');
const fetch = require('node-fetch');
const path = require('path');
const i18next = require('i18next');
const i18nextMiddleware = require('i18next-express-middleware');
const Backend = require('i18next-node-fs-backend');
const app = express();
const fs = require('fs');
const builder = require('xmlbuilder');
const cron = require('node-cron');
const moment = require('moment');

// const API_BASE = 'https://donut-dot-hottab-in.appspot.com';                     // Dev
// const API_BASE = 'https://donut-dot-hottab-pw.appspot.com';                     // Staging
const API_BASE = 'http://donut.hottab.asia';
// Production
// const API_SECRET_KEY = 'qbktxJY33PKha53jkCpdu6CkFJNZvqds';                      // Dev
// const API_SECRET_KEY = 'qbktxJY33PKha53jkCpdu6CkFJNZvqds';                      // Staging
const API_SECRET_KEY = 'VNL597QypdptbydjBt3jT4yxaYSQYNGe7EWCavXCYZQ6gZ9Z';
// Production
// const SITEMAP_API_SECRET_KEY = 'AIzaSyCs_XLhLgfW7x95DpoSjqs0F_Khde2Niqs';       // Dev
// const SITEMAP_API_SECRET_KEY = 'AIzaSyCs_XLhLgfW7x95DpoSjqs0F_Khde2Niqs';       // Staging
const SITEMAP_API_SECRET_KEY = 'AIzaSyB92R4xtPXCLvpSGY0nPxQqUr5kO30ib5Q'; // Production


app.use(express.static(path.join(__dirname, 'dist')));
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'pug');

i18next.use(i18nextMiddleware.LanguageDetector).use(Backend).init({
    fallbackLng: 'en',
    preload: ['en'],
    ns: ['translations'],
    backend: {
        loadPath: path.join(__dirname, '/locales/ {{lng}}/{{ns}}.json'),
        addPath: path.join(__dirname, '/locales/ {{lng}}/{{ns}}.missing.json')
    }
})

app.use(i18nextMiddleware.handle(i18next));

Number.prototype.format = function (n, x) {
    const re = '\\d(?=(\\d{' + (
        x || 3
    ) + '})+' + (
    n > 0 ? '\\.' : '$'
) + ')';
    return this.toFixed(Math.max(0, ~~ n)).replace(new RegExp(re, 'g'), '$&,');
};

const getCurrency = (price, symbol) => {
    let currency,
        result;
    switch (symbol) {
        case '₫': currency = price ? Number(price).format() : 0;
            result = [currency, symbol].join(' ');
            break;
        case '$': currency = price ? Number(price).format(2) : 0;
            result = [symbol, currency].join(' ');
            break;
        default: currency = price ? Number(price).format(2) : 0;
            result = [symbol, currency].join(' ');
            break;
    }
    return result;
}

const apiGet = (url, params) => {
    const urlParams = params ? Object.keys(params).map(key => `${key}=${
        encodeURIComponent(params[key])
    }`) : '';
    return fetch(`${API_BASE}${url}?secret_key=${API_SECRET_KEY}&${urlParams}`, {
        method: 'GET',
        timeout: 10000
    }).then(res => res.json()).then(json => json.data || null).catch(err => console.log('err', err));
};

app.get('/:slug', (req, res, next) => {
    const userAgent = req.headers['user-agent'].toLowerCase();
    if (userAgent.match(/(googlebot|bingbot|twitterbot|facebookexternalhit|pinterest|slackbot)/)) {
        const {slug} = req.params;
        if (!slug) {
            next();
            return;
        }
        const url = req.protocol + '://' + req.get('host') + req.originalUrl;
        apiGet('/restaurant/outlet-by-slug', {slug}).then(ret => {
            if (ret) {
                const defaultLogo = '/images/default_img.png';
                const defaultDescription = `View ${
                    ret.name
                } menu and order delivery or takeaway on #HOTTAB. ${
                    ret.name
                } ${
                    ret.phone
                } ${
                    ret.address
                }`;
                res.render('restaurant', {
                    img: ret.logo || defaultLogo,
                    url: url,
                    title: ret.name + ' | Delivery or Takeaway | #HOTTAB',
                    descriptionText: defaultDescription,
                    imageUrl: ret.logo || defaultLogo,
                    phone: ret.phone,
                    address: ret.address,
                    has_menu: ret.has_menu,
                    open_hours: ret.open_hours,
                    long: ret.long,
                    lat: ret.lat
                });
            } else {
                next();
            }
        });
    } else {
        next();
    }
});

app.get('/voucher/claim', (req, res, next) => {
    const userAgent = req.headers['user-agent'].toLowerCase();
    if (userAgent.match(/(googlebot|bingbot|twitterbot|facebookexternalhit|pinterest|slackbot)/)) {
        const {code} = req.query;
        if (!code) {
            next();
            return;
        }
        const url = req.protocol + '://' + req.get('host') + req.originalUrl;
        apiGet(`/customer/vouchers/${code}`, {lang: 'en'}).then(ret => {
            if (ret) {
                const amount = getCurrency(ret.amount, ret.currency.symbol);
                const description = `Here's a free cash voucher for you worth ${amount} from ${
                    ret.outlet.name
                } on #HOTTAB. Click on it to claim and use on your next order.`;
                res.render('claim-voucher', {
                    url: url,
                    title: 'Claim ' + amount + ' from ' + ret.outlet.name,
                    descriptionText: description,
                    imageUrl: ret.outlet.cover || ret.outlet.logo
                });
            } else {
                next();
            }
        });
    } else {
        next();
    }
});

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'))
});

// app.listen(process.env.PORT || 8080);

const writeSitemap = () => {
    const filePath = 'public/sitemap.xml';
    const bkFilePath = 'public/sitemap.bk.xml';
    fetch(`${API_BASE}/restaurant/site-map?key=${SITEMAP_API_SECRET_KEY}&pagination=10000`).then(res => res.json()).then(json => json.data || null).then(res => {
        const urlset = builder.create('urlset');
        urlset.att('xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9');
        urlset.ele('url').ele('loc', {}, 'https://hottab.co/').up().ele('lastmod', {}, moment().format('YYYY-MM-DDTHH:mm:ss+00:00')).up().ele('changefreq', 'daily').up().ele('priority', '1.00')
        for (let i = 0; i < res.data.length; i++) {
            urlset.ele('url').ele('loc', {}, 'https://hottab.co/' + res.data[i].slug).up().ele('lastmod', {}, moment().format('YYYY-MM-DDTHH:mm:ss+00:00')).up().ele('changefreq', 'daily').up().ele('priority', '0.80')
        }
        const xml = urlset.end({pretty: true});
        // Delete back up file
        if (fs.existsSync(bkFilePath)) { // Check file exist
            fs.unlink(bkFilePath, function (err) {
                if (err) 
                    console.log('error: ' + err);
                
            });
        }
        // Back up file
        if (fs.existsSync(filePath)) { // Check file exist
            fs.rename(filePath, bkFilePath, function (err) {
                if (err) 
                    console.log('error: ' + err);
                
            });
        }
        // Write file
        fs.writeFile(filePath, xml, function (err) {
            if (err) { // In case write file error
                console.log('error: ' + err);
                if (fs.existsSync(bkFilePath)) {
                    // check file exist
                    // Revert old file
                    fs.rename(bkFilePath, filePath, function (err) {
                        if (err) 
                            console.log('error: ' + err);
                        
                    });
                }
            }
        });
    });
} cron.schedule('0 22 * * *', () => {
    console.log('schedule started ' + moment().format('YYYY-MM-DDTHH:mm:ss+00:00'));
    writeSitemap();
});

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// parse application/json
app.use(bodyParser.json())

let mydb,
    cloudant;
var vendor;
// Because the MongoDB and Cloudant use different API commands, we
// have to check which command should be used based on the database
// vendor.
var dbName = 'mydb';

// Separate functions are provided for inserting/retrieving content from
// MongoDB and Cloudant databases. These functions must be prefixed by a
// value that may be assigned to the 'vendor' variable, such as 'mongodb' or
// 'cloudant' (i.e., 'cloudantInsertOne' and 'mongodbInsertOne')

var insertOne = {};
var getAll = {};

insertOne.cloudant = function (doc, response) {
    mydb.insert(doc, function (err, body, header) {
        if (err) {
            console.log('[mydb.insert] ', err.message);
            response.send("Error");
            return;
        }
        doc._id = body.id;
        response.send(doc);
    });
}

getAll.cloudant = function (response) {
    var names = [];
    mydb.list({
        include_docs: true
    }, function (err, body) {
        if (! err) {
            body.rows.forEach(function (row) {
                if (row.doc.name) 
                    names.push(row.doc.name);
                
            });
            response.json(names);
        }
    });
    // return names;
}

let collectionName = 'mycollection'; // MongoDB requires a collection name.

insertOne.mongodb = function (doc, response) {
    mydb.collection(collectionName).insertOne(doc, function (err, body, header) {
        if (err) {
            console.log('[mydb.insertOne] ', err.message);
            response.send("Error");
            return;
        }
        doc._id = body.id;
        response.send(doc);
    });
}

getAll.mongodb = function (response) {
    var names = [];
    mydb.collection(collectionName).find({}, {
        fields: {
            _id: 0,
            count: 0
        }
    }).toArray(function (err, result) {
        if (! err) {
            result.forEach(function (row) {
                names.push(row.name);
            });
            response.json(names);
        }
    });
}

/* Endpoint to greet and add a new visitor to database.
* Send a POST request to localhost:3000/api/visitors with body
* {
*   "name": "Bob"
* }
*/
app.post("/api/visitors", function (request, response) {
    var userName = request.body.name;
    var doc = {
        "name": userName
    };
    if (! mydb) {
        console.log("No database.");
        response.send(doc);
        return;
    }
    insertOne[vendor](doc, response);
});

/**
 * Endpoint to get a JSON array of all the visitors in the database
 * REST API example:
 * <code>
 * GET http://localhost:3000/api/visitors
 * </code>
 *
 * Response:
 * [ "Bob", "Jane" ]
 * @return An array of all the visitor names
 */
app.get("/api/visitors", function (request, response) {
    var names = [];
    if (! mydb) {
        response.json(names);
        return;
    }
    getAll[vendor](response);
});

// load local VCAP configuration  and service credentials
var vcapLocal;
try {
    vcapLocal = require('./vcap-local.json');
    console.log("Loaded local VCAP", vcapLocal);
} catch (e) {}

const appEnvOpts = vcapLocal ? {
    vcap: vcapLocal
} : {}

const appEnv = cfenv.getAppEnv(appEnvOpts);

if (appEnv.services['compose-for-mongodb'] || appEnv.getService(/.*[Mm][Oo][Nn][Gg][Oo].*/)) { // Load the MongoDB library.
    var MongoClient = require('mongodb').MongoClient;

    dbName = 'mydb';

    // Initialize database with credentials
    if (appEnv.services['compose-for-mongodb']) {
        MongoClient.connect(appEnv.services['compose-for-mongodb'][0].credentials.uri, null, function (err, db) {
            if (err) {
                console.log(err);
            } else {
                mydb = db.db(dbName);
                console.log("Created database: " + dbName);
            }
        });
    } else { // user-provided service with 'mongodb' in its name
        MongoClient.connect(appEnv.getService(/.*[Mm][Oo][Nn][Gg][Oo].*/).credentials.uri, null, function (err, db) {
            if (err) {
                console.log(err);
            } else {
                mydb = db.db(dbName);
                console.log("Created database: " + dbName);
            }
        });
    } vendor = 'mongodb';
} else if (appEnv.services['cloudantNoSQLDB'] || appEnv.getService(/[Cc][Ll][Oo][Uu][Dd][Aa][Nn][Tt]/)) { // Load the Cloudant library.
    var Cloudant = require('@cloudant/cloudant');

    // Initialize database with credentials
    if (appEnv.services['cloudantNoSQLDB']) { // CF service named 'cloudantNoSQLDB'
        cloudant = Cloudant(appEnv.services['cloudantNoSQLDB'][0].credentials);
    } else { // user-provided service with 'cloudant' in its name
        cloudant = Cloudant(appEnv.getService(/cloudant/).credentials);
    }
} else if (process.env.CLOUDANT_URL) {
    cloudant = Cloudant(process.env.CLOUDANT_URL);
}
if (cloudant) { // database name
    dbName = 'mydb';

    // Create a new "mydb" database.
    cloudant.db.create(dbName, function (err, data) {
        if (! err)  // err if database doesn't already exists
            console.log("Created database: " + dbName);
        
    });

    // Specify the database we are going to use (mydb)...
    mydb = cloudant.db.use(dbName);

    vendor = 'cloudant';
}

// serve static file (index.html, images, css)
app.use(express.static(__dirname + '/views'));


var port = process.env.PORT || 3000
app.listen(port, function () {
    console.log("To view your app, open this link in your browser: http://localhost:" + port);
});
