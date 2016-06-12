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
            propertytype: this.getPropertyType($),
            propertylocation: this.getLocation($),
            propertydistrict: this.getDistrict($),
            price: this.getPrice($),
            propertytransactiontype: this.getTransactionType($),
            numberofrooms: this.getNumOfRooms($),
            numberofbathrooms: this.getNumOfBaths($),
            floornumber: this.getFloorNum($),
            area: this.getArea($),
            tags: this.getTags($),
            condition: this.getCondition($),
            orientation: this.getOrientation($),
            distancetosea: this.getDistanceToSea($),
            gpslocation: this.getGpsLocation($),
            images: this.getImages($),
            url: propertylink,
            localurl: this.getLocalUrl($)
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
    //TODO: change getter to better one
    getLocation($){
        try{
            // original getter
            return $('.pageH2').text().split(/\ben\b|\bzona\b/).map(str => str.trim())[1];
            // suggestion: $('.pageH2').text().match(/\ben\s(\S+)/)[1]
        }catch(e){
            console.log('error in getting Location', e);
            return '';
        }
    }
    //TODO: change getter to better one
    getDistrict($){
        try{
            //return $('.pageH2').text().split(/\ben\b|\bzona\b/).map(str => str.trim())[2];
            //suggestion:
            return $('.pageH2').text().match(/zona\s*(.+)/)[1].trim();
        }catch(e){
            console.log('error in getting District', e);
            return '';
        }
    }

    getPrice($){
        try{
            // original return $('.titulo-vivienda').text().match(/\d+\.\d+/, '')[0];
            return $('.titulo-vivienda').text().match(/\d+\.?\d+\.?\d+/g)[0].replace(/\./, ''); // check is needed
        } catch(e){
            console.log('error in getting Price', e);
            return '';
        }
    }

    getTransactionType($){
        // original return $('body > div:nth-child(3) > div.row.hidden-print > div > ol > li:nth-child(2) > a').text().trim();
        return $('ol.breadcrumb > li:nth-child(2) > a').text().trim(); // check is needed
    }

    getNumOfRooms($){
        try {
            return parseInt($('.alert-warning').text().replace(/\D+/g, ''), 10) || 0;
        } catch(e){
            console.log('error in getting Rooms', e);
            return 0;
        }
    }

    getNumOfBaths($){
        try{
            return parseInt( $('.alert-info').text().replace(/\D+/g, ''), 10) || 0;
        }catch(e){
            console.log('error in getting Bathrooms', e);
            return 0;
        }
    }

    getFloorNum($){
        try {
            return parseInt($('li:contains("Planta")').text().replace(/\D+/g, ''), 10) || 0;
        }catch(e){
            console.log('error in getting Floornum', e);
            return 0;
        }
    }

    getArea($){
        return parseInt( $('.alert-metros-cuadrados').text().replace(/\D+/g, ''), 10);
    }

    getTags($){
        try{
            const tags = $('.bordeAmarillo:not(".text-left")').first()[0].next.data.replace(/^\s*|\.\s*$/g, '');
            // console.log(tags.split(/\,/).map(function(elem){ return elem.trim()}));
            return  tags ? tags.split(/\,/).map( elem => elem.trim() ) : [] ;
        }catch(e){
            console.log('error in getTags', e);
            return [];
        }
    }

    getCondition($){
        try{
            return $('strong:contains("Estado")')[0].next.data.replace(/^\s*|\s*$/g, '');
        }catch(e){
            console.log('error in get conditions', e);
            return '';
        }
    }

    getOrientation($){
        try{
            return $('strong:contains("Orientación")')[0].next.data.replace(/^\s*|\s*$/g, '');
        }catch(e){
            console.log('error in get orientation', e);
            return '';
        }
    }

    getDistanceToSea($){
        try{
            return parseInt( $('strong:contains("Distancia al mar")')[0].next.data.match(/\d+/g), 10) || 0;
        }catch(e){
            console.log('error in get getDistanceToSea', e);
            return 0;
        }
    }

    getGpsLocation($){
        try{
            return $('h3:contains("Localización")').next().attr('src').match(/(?:(?!\|))\d+.*?(?=&)/g)[0];
        }catch(e){
            console.log('error in get getGpsLocation', e);
            return '';
        }
    }

    getImages($){
        return $('#galeria-thumbs a').map( (i, link) => $(link).attr('href') ).toArray();
    }

    getLocalUrl($){

        const propType = this.getPropertyType($);
        const location = this.getLocation($);
        const numOfRooms = this.getNumOfRooms($);
        const reference  = this.getReference($);
        const realEstateName = this.realEstateName;

        return `${propType}-en-${location}-con-${numOfRooms}-habitaciones-${realEstateName}-${reference}.html`;
    }
}

module.exports = Parser;
