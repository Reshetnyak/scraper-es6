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

        /*
        1) set page limit ( take form options || take from page)
        2) until limit repeat:
        3)   get page with offers
        4)      get offer links
        5)      for each offer link:
        6)          get offer
        7)          parse offer
        8)          save data
        */

        this.setPageLimit()
            .then( this.parseOfferListPages.bind(this) );

    }
};

scraper.init({
        limit: 2,
        delay: 1000
    });
