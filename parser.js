/*jshint esnext:true*/
const cheerio = require('cheerio');

class Parser{
    constructor(options = {}){

        const defaults = {
            realEstateName: 'Visual-Home'
        };

        this.options = Object.assign(defaults, options);
    }

    parse(html, propertylink){
        const $ = cheerio.load(html);

        const property = {
            propertyvendor: this.options.realEstateName,
            reference: this.getReference($),
            propertytype: getPropertyType($),
//            propertylocation: getLocation(),
//            propertydistrict: getDistrict(),
//            price: getPrice(),
//            propertytransactiontype: getTransactionType(),
//            numberofrooms: getNumOfRooms(),
//            numberofbathrooms: getNumOfBaths(),
//            floornumber: getFloorNum(),
//            area: getArea(),
//            tags: getTags(),
//            condition: getCondition(),
//            orientation: getOrientation(),
//            distancetosea: getDistanceToSea(),
//            gpslocation: getGpsLocation(),
//            images: imageArray,
            url: propertylink,
//            localurl: localUrl
        };

        return property;
    }

    getReference($){
        try{
            return $('.colorAAA').text().match(/\:\s*(.+)/)[1];
        }catch(e){
            console.log('error in getting Reference', e);
            return '';
        }
    }

    getPropertyType($){
        try{
            return $('body > div:nth-child(3) > div:nth-child(1) > div > h2').text().trim().match(/^\s*\S+/)[0];
        }catch(e){
            console.log('Error in scraping Orientation', e);
            return '';
        }
    }
}

module.exports = Parser;
/*
parseOffer(body, offerLink){

        var $ = cheerio.load(body);

        //console.log($('body').html());

        var realEstateName = 'Visual-Home';


        var

        var getLocation  = () => {
            try{
                return $('.pageH2').text().split(/\ben\b|\bzona\b/).map(str => str.trim())[1];
            }catch(e){
                console.log('error in getting Location', e);
            }
            return '';
        };

        var getDistrict  = () => {
            try{
                return $('.pageH2').text().split(/\ben\b|\bzona\b/).map(str => str.trim())[2];
            }catch(e){
                console.log('error in getting District', e);
                return '';
            }
            return '';
        };

        var getPrice      = () => ($('.titulo-vivienda').text().match(/\d+\.\d+/, '') || [''] )[0];

        var getTransactionType      = () => $('body > div:nth-child(3) > div.row.hidden-print > div > ol > li:nth-child(2) > a').text().trim();

        var getNumOfRooms = () => {
          try {
            return parseInt($('.alert-warning').text().replace(/\D+/g, ''), 10) || 0;
          } catch(e){
            console.log('error in getting Rooms', e);
            //return 0;
          }
          return 0;
        };

        var getNumOfBaths = () => {
          try{
            return parseInt( $('.alert-info').text().replace(/\D+/g, ''), 10) || 0;
          }catch(e){
            console.log('error in getting Bathrooms', e);
            return 0;
          }
            return 0;
        };

        var getFloorNum = () => {
          try {
            return parseInt($('li:contains("Planta")').text().replace(/\D+/g, ''), 10) || 0;
          }catch(e){
            console.log('error in getting Floornum', e);
            return 0;
          }
            return 0;
        };

        var getArea = () => parseInt($('.alert-metros-cuadrados').text().replace(/\D+/g, ''));

        var getTags = () => {
            try{
              var tags = $('.bordeAmarillo:not(".text-left")').first()[0].next.data.replace(/^\s*|\.\s*$/g, '');
                // console.log(tags.split(/\,/).map(function(elem){ return elem.trim()}));
                return  tags ? tags.split(/\,/).map(function(elem){ return elem.trim()}) : [] ;
            }catch(e){
                console.log('error in getTags', e);
                return [];
            }

            return '';
        };


        var getCondition = () => {
            try{
                return $('strong:contains("Estado")')[0].next.data.replace(/^\s*|\s*$/g, '');
            }catch(e){
                console.log('error in get conditions', e);
                return '';
            }

            return '';
        };

        var getOrientation = () => {
            try{
                return $('strong:contains("Orientación")')[0].next.data.replace(/^\s*|\s*$/g, '');
            }catch(e){
                console.log('error in get orientation', e);
                return '';
            }

            return '';
        };

        var getDistanceToSea = () => {
            try{
                return parseInt($('strong:contains("Distancia al mar")')[0].next.data.match(/\d+/g), 10) || 0;
            }catch(e){
                console.log('error in get getDistanceToSea', e);
                return 0;
            }

            return '';
        };

        var getGpsLocation = () => {
            try{
                return $('h3:contains("Localización")').next().attr('src').match(/(?:(?!\|))\d+.*?(?=&)/g)[0];
            }catch(e){
                console.log('error in get getGpsLocation', e);
                return '';
            }

            return '';
        };

        var imageArray = [];

        var getImages = $('#galeria-thumbs a').each((i, link) => imageArray.push( $(link).attr('href') ));//.map((i, link) => $(link).attr('href') );

        var localUrl = getPropertyType() + '-en-' + getLocation() + '-con-' + getNumOfRooms() + '-habitaciones-' + realEstateName + '-' + getReference() + '.html';

        var property = {
            propertyvendor: realEstateName,
            reference: getReference(),
            propertytype: getPropertyType(),
            propertylocation: getLocation(),
            propertydistrict: getDistrict(),
            price: getPrice(),
            propertytransactiontype: getTransactionType(),
            numberofrooms: getNumOfRooms(),
            numberofbathrooms: getNumOfBaths(),
            floornumber: getFloorNum(),
            area: getArea(),
            tags: getTags(),
            condition: getCondition(),
            orientation: getOrientation(),
            distancetosea: getDistanceToSea(),
            gpslocation: getGpsLocation(),
            images: imageArray,
            url: offerLink,
            localurl: localUrl
        };

        return property;
    }
    */
