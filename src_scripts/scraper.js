/*jshint esnext: true*/
import request from './request.js';
import throttledForEach from './throttledForEach.js';
import cheerio from 'cheerio';

const scraper = {
    setPageLimit(){

        let needToGetFromPage = this.options.hasOwnProperty('limit') === false;

        let limitIsSet = new Promise( (resolve, reject) => {

            if (needToGetFromPage){
                this.getMaxNumOfPages()
                    .then( maxPageNum => {
                        this.options.limit = maxPageNum;
                        resolve();
                    });
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
            .catch(e => console.log('error from request', e));
        });

        return promise;
    },
    parseOfferListPages(){
        console.log('in parse offer list pages: ', this.options);
    },
    init(options = {}){

        const defaults = {
            baseUrl: 'http://www.visual-home.es/',
            pageUrlPart: 'pisos-benidorm/index/index/page/',
            delay: 2000,
            startWith: 0
        };

        // set options
        this.options = Object.assign(defaults, options);

        this.setPageLimit()
            .then( () => this.parseOfferListPages() );
            //.then( this.parseOfferListPages );
    }
};

//var arr = [1, 2, 3, 4, 5];

scraper.init();

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
