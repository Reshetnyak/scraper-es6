/*jshint esnext: true*/
const request = require('./request.js');
const cheerio = require('cheerio');
const utils = require('./utils.js');
const When = require('./when.js');

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

            yield this.setPageLimit();

            const listPageUrls = this.getListPageUrls();

            for(let listPageUrl of listPageUrls){

                let listPageHtml = yield this.getListPage(listPageUrl);
                console.info('listPage has gotten');
                let propertylinks = this.getPropertyLinks(listPageHtml);

                yield* this.parseProperties(propertylinks);
            }
        }.bind(this);

        const asyncScenario = When.async( scenario );

        asyncScenario()
            .then(result => console.log('job\'s done!', result))
            .catch( reason => console.log('There was a problem', reason));
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
        return request(listPageUrl, this.options.delay);
    }
    getPropertyLinks(listPageHtml){
        let $ = cheerio.load(listPageHtml);
        let propLinks = [];

        console.log('getPropertyLinks: ', $('title').text());
        const {baseUrl} = this.options;

        try{
            propLinks = $('.listadoH3 > a')
                    .map( (i, a) => `${baseUrl}${$(a).attr('href')}` )
                    .toArray();
        } catch(e) {
            console.log('From getPropertyLinks: ', e);
        }

        return propLinks;
    }
    getPropertyHtml(propertyLink){
        return request(propertyLink, this.options.delay);
    }
    parseData(propHtml, propertylink){
        console.log('in parse data');
        const {parser} = this.options;

        return parser.parse(propHtml, propertylink);
    }
    saveData(propData){
        console.log('savaData', propData);
        return When.resolve(true);
    }
    * parseProperties(propertylinks){

        for(let propertylink of propertylinks){
            let propPageHtml = yield this.getPropertyHtml(propertylink);
            let data = this.parseData( propPageHtml, propertylink );
            yield this.saveData( data );
            console.info('data was saved for ' + propertylink );
        }

    }
}
module.exports = Scraper;
