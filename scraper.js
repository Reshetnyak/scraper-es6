/*jshint esnext: true*/
const request = require('./request.js');
const cheerio = require('cheerio');
const utils = require('./utils.js');
const When = require('./When.js');

class Scraper{

    constructor(options = {}){

        const defaults = {
            baseUrl: 'http://www.visual-home.es/',
            pageUrlPart: 'pisos-benidorm/index/index/page/',
            delay: 2000,
            startWith: 1
        };

        // set options
        this.options = Object.assign(defaults, options);
    }

    run(){

        const scenario = function*(){
            //console.log(this);
            yield this.setPageLimit();
            //this.parseOfferListPages();//.bind(scraper);
            const listPageUrls = this.getListPageUrls();
            console.log('aga', listPageUrls);


            for(var listPageUrl of listPageUrls){
                var listPageHtml = yield this.getListPage(listPageUrl);
                console.info('listPage has gotten');
                var links = getLinks(listPageHtml);
//
//                for(var link of links){
//                    var propPageHtml = yield getPropHtml(link);
//                    var data = parseData( propPageHtml );
//                    yield saveData( data );
//                    console.info('data was saved for ' + link );
//                }
            }
        }.bind(this);

        const asyncScenario = When.async( scenario );

        asyncScenario()
            .then(result => console.log('job\'s done!', result))
            .catch( reason => console.log('There was a problem', resaon));
    }
    // If there was no limit provided by class options it would be taken from page
    // Limit represents number of pages (with the list of offers) for parsing
    setPageLimit(){

        const needToGetFromPage = this.options.hasOwnProperty('limit') === false;

        return new When( (resolve, reject) => {

            if (needToGetFromPage){

                const setLimit = maxPageNum => this.options.limit = maxPageNum;

                this.getMaxNumOfPages()
                    .then( setLimit )
                    .then( () => resolve() )
                    .catch( e => reject(e) );
            } else {
                resolve();
            }
        });
    }
    // get home page and parse last page number
    getMaxNumOfPages(){

        const {baseUrl, pageUrlPart, startWith, delay} = this.options;

        const url = `${baseUrl}${pageUrlPart}${startWith}`;

        console.log( 'home page url is: ', url );

        return new When( (resolve, reject) => {

            request(url, delay).then( html => {

                let maxPageNum = getMaxPageNum( html );

                resolve(maxPageNum);
            })
            .catch(e => reject(e));
        });

        function getMaxPageNum(html){

            const $ = cheerio.load(html);
            let maxPageNum = 0;

            try{
                maxPageNum = $('.pagination li > a').last().parent().prev().find('a').text();
            } catch(e){
                console.log('From getMaxPageNum: ', e);
            }

            console.log('max page num is: ', maxPageNum);

            return maxPageNum;
        }
    }
    getListPageUrls(){
        const {baseUrl, pageUrlPart, startWith, limit} = this.options;

        const base = `${baseUrl}${pageUrlPart}`;

        return utils.range(startWith, limit).map( pageNum => base + pageNum );
    }
    getListPage(listPageUrl){
        console.log(this.options.delay);
        return request(listPageUrl, this.options.delay)
    }
    parseOfferListPages(){
        console.log('parse', this);

    }
}

const scraper = new Scraper({ limit: 2, delay: 2000 });
//const scraper = new Scraper({ delay: 1500 });
scraper.run();

/* ---- new scraper with sequenses ------ */

var listPagesUrls = [1,2,3].map( n => 'listUrl_' + n );

//var test = [1,2,3,4].map( n => timeoutedValue( n ) );


function getPropertiesLinks(listPageHtml){
    console.log('html form ', listPageHtml);
    return [1,2,3,4].map( n => 'propUrl_' + n );
}

function parseProperties(propUrls){
    return makeDelayedSequense(propUrls, getProperty)
              .then( ()=> console.info('props pages were parsed') )
              .catch(
                reason => ( console.error('problem in parseProperties'), reason )
               )
}

// TODO: change to ParseProperty
function getProperty( url ){
    //TODO: change to getProperty
    return timeoutedValue(url)
            .then( parseProperty )
            .then( saveData )
}

function parseProperty( data ){
    console.log( 'parseProperty input', data );

    return {hello: 'world'};
}

function saveData( o ){
    console.log('data was saved', o);
    return true;
}

function makeDelayedSequense(arr, fn, delay=(Math.random()*1000), context=null){

    return arr.reduce( (sequence, el) => {

       return sequence.delay(delay).then( fn.bind(context, el) );

    }, When.resolve());
}

function makeSequence(arr, fn, context=null){

    return arr.reduce( (sequence, el) => {

       return sequence.then( fn.bind(context, el) );

    }, When.resolve());
}


function parse(listPagesUrls){
    return makeDelayedSequense(listPagesUrls, getListPage);
}
function getListPage(listPageUrl, delay){
    return timeoutedValue(listPageUrl, delay)
        .then( getPropertiesLinks )
        .then( parseProperties )
        .catch( e => console.error( 'from listpage', e ) )
}

//parse(listPagesUrls).then( v=>console.log('jobsdone', console.timeEnd('listPagesUrls')) );

/*























const scraperOld = {
    setPageLimit(){

        let needToGetFromPage = this.options.hasOwnProperty('limit') === false;

        let limitIsSet = new When( (resolve, reject) => {

            if (needToGetFromPage){

                let setLimit = maxPageNum => this.options.limit = maxPageNum;

                this.getMaxNumOfPages()
                    .then( setLimit )
                    .then( () => resolve() )
                    .catch( e => reject(e) );
            } else {
                resolve();
            }
        });

        return limitIsSet;
    },
    getMaxNumOfPages(){

        let {baseUrl, pageUrlPart, startWith} = this.options;

        let url = `${baseUrl}${pageUrlPart}${startWith}`;

        console.log( 'url', url );

        let promise = new When( (resolve, reject) => {

            request(url).then( html => {

                let maxPageNum = getMaxPageNum( html );

                resolve(maxPageNum);
            })
            .catch(e => reject(e));
        });

        return promise;

        function getMaxPageNum(html){

            let $ = cheerio.load(html);
            let maxPageNum = 0;

            try{
                maxPageNum = $('.pagination li > a').last().parent().prev().find('a').text();
            } catch(e){
                console.log('From getMaxPageNum: ', e);
            }

            console.log('max page num is: ', maxPageNum);

            return maxPageNum;
        }
    },
    parseOfferListPages(){

        let getListsUrls = () => {

            let {startWith, limit} = this.options;
            let pageNums = utils.range(startWith, limit);

            let {baseUrl, pageUrlPart} = this.options;
            // path to offer list page without number;
            let path = `${baseUrl}${pageUrlPart}`;

            let offerListUrls = pageNums.map( pageNum => `${path}${pageNum}` );

            return offerListUrls;
        };

        let offerListUrls = getListsUrls();

        throttledForEach(offerListUrls, this.getOfferListPage.bind(this))
            .then(()=> console.warn('succeeded!!!'));

    },
    getOfferListPage(offerListPageUrl, i, arr, promise){

        console.log( 'offerListPageUrl', offerListPageUrl );

        let scraper = this;

        request(offerListPageUrl)
            .then( html => {

                let offerLinks = getOfferLinks(html);
            //console.log(offerLinks);
                throttledForEach(offerLinks, this.getOfferPage.bind(scraper))
                    .then(() => {
                        console.log('_________offer was parsed');
                        promise.resolve();
                    });
            })
            .catch( e => console.log('From getOfferListPage: ', e) );

        function getOfferLinks(html){

            let $ = cheerio.load(html);
            let offerLinks = [];

            console.log($('title').text());

            try{
                offerLinks = $('.listadoH3 > a').map( (i, a) => $(a).attr('href') ).toArray();
            } catch(e) {
                console.log('From getOfferLinks: ', e);
            }

            return offerLinks;
        }

    },
    getOfferPage(offerLinkPart, i, arr, promise){

        let scraper = this;
        let {baseUrl} = this.options;
        let offerLink = `${baseUrl}${offerLinkPart}`;

        request(offerLink)
            .then( html => scraper.parseOffer(html, promise) )
            .catch( e => console.log('From getOfferPage', e));
    },
    parseOffer(offerHtml, promise){

        let $ = cheerio.load(offerHtml);

        console.log( $('.pageH2').text() );

        promise.resolve();

    },
    init(options = {}){

        const defaults = {
            baseUrl: 'http://www.visual-home.es/',
            pageUrlPart: 'pisos-benidorm/index/index/page/',
            delay: 2000,
            startWith: 1
        };

        // set options
        this.options = Object.assign(defaults, options);



        this.setPageLimit()
            .then( this.parseOfferListPages.bind(this) );

    }
};

scraperOld.init({
        limit: 2,
        delay: 1000
    });
*/
