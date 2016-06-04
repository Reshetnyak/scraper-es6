/*jshint esnext: true*/
import request from './request.js';
import throttledForEach from './throttledForEach.js';
import cheerio from 'cheerio';
import utils from './utils.js';

const scraper = {
    setPageLimit(){

        let needToGetFromPage = this.options.hasOwnProperty('limit') === false;

        let limitIsSet = new Promise( (resolve, reject) => {

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

        let promise = new Promise( (resolve, reject) => {

            request(url).then( html => {
                let $ = cheerio.load(html);

                let maxPageNum = $('.pagination li > a').last().parent().prev().find('a').text();
                console.log('max num is: ', maxPageNum);
                resolve(maxPageNum);
            })
            .catch(e => reject(e));
        });

        return promise;
    },
    parseOfferListPages(){

        let {startWith, limit} = this.options;
        let pageNums = utils.range(startWith, limit);

        throttledForEach(pageNums, this.getOfferListPage.bind(this))
            .then(()=> console.warn('succeeded!!!'));

        //console.log('in parse offer list pages: ', this.options);
    },
    getOfferListPage(pagenum, i, arr, promise){

        let {baseUrl, pageUrlPart} = this.options;

        let offerListPageUrl = `${baseUrl}${pageUrlPart}${pagenum}`;

        console.log( 'offerListPageUrl', offerListPageUrl );

        let scraper = this;

        request(offerListPageUrl)
            .then( html => {
                let $ = cheerio.load(html);

                console.log($('title').text());

                let offerLinks = this.getOfferLinks($);
            //console.log(offerLinks);
                throttledForEach(offerLinks, this.getOfferPage.bind(scraper))
                    .then(() => {
                        console.log('_________offer was parsed');
                        promise.resolve();
                    });
            })
            .catch( e => console.log('From getOfferListPage: ', e) );

    },
    getOfferLinks($){
        return $('.listadoH3 > a').map( (i, a) => $(a).attr('href') ).toArray();
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
            //.then( this.parseOfferListPages );
    }
};

scraper.init({
        limit: 2,
        delay: 1000
    });

//throttledForEach(arr, log).then(()=> console.warn('succeeded!!!'));
/*
function log(item, i, arr, promise) {

    console.log('outer started :', item, i, arr);

    var innerArr = Array.apply(null , Array(item)).map((n,i)=>i + 1);

    throttledForEach(innerArr, logInner).then(
        () => { promise.resolve('outer finished'); }
    );
}

function logInner(item, i, arr, promise) {

    console.info('inner started: ', item, i, arr);

    promise.resolve('inner finished');
}
*/
