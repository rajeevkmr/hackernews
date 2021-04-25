const fetch = require('node-fetch');
const fs = require('fs');
const builder = require('xmlbuilder');
const moment  = require('moment');

const filePath = 'public/sitemap.xml';
const bkFilePath = 'public/sitemap.bk.xml';
fetch(`https://donut-dot-hottab-in.appspot.com/restaurant/site-map?key=AIzaSyCs_XLhLgfW7x95DpoSjqs0F_Khde2Niqs&pagination=10000`)
.then(res => res.json())
.then(json => json.data || null)
.then(res => {
    const urlset = builder.create('urlset');
    urlset.att('xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9');
    urlset
        .ele('url')
            .ele('loc', {}, 'https://sopa.asia/')
                .up()
            .ele('lastmod', {}, moment().format('YYYY-MM-DDTHH:mm:ss+00:00'))
                .up()
            .ele('changefreq', 'daily')
                .up()
            .ele('priority', '1.00')
    for(let i = 0; i < res.data.length; i++) {
        urlset
            .ele('url')
                .ele('loc', {}, 'https://sopa.asia/' + res.data[i].slug)
                    .up()
                .ele('lastmod', {}, moment().format('YYYY-MM-DDTHH:mm:ss+00:00'))
                    .up()
                .ele('changefreq', 'daily')
                    .up()
                .ele('priority', '0.80')
    }
    const xml = urlset.end({ pretty: true });
    // Delete back up file
    if (fs.existsSync(bkFilePath)) { // Check file exist
        fs.unlink(bkFilePath, function(err) {
            if (err) console.log('error: ' + err);
        });
    }
    // Back up file
    if (fs.existsSync(filePath)) { // Check file exist
        fs.rename(filePath, bkFilePath, function(err) {
            if (err) console.log('error: ' + err);
        });
    }
    // Write file
    fs.writeFile(filePath, xml, function(err){
        if (err) { // In case write file error
            console.log('error: ' + err);
            if (fs.existsSync(bkFilePath)) { // check file exist
                // Revert old file
                fs.rename(bkFilePath, filePath, function(err) {
                    if (err) console.log('error: ' + err);
                });
            }
        }
    });
});
