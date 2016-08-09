const Parser = require('./parser.js');
const Scraper = require('./when.js');

const parser  = new Parser();
const scraper = new Scraper({ limit: 2, delay: 300, parser: parser });
//const scraper = new Scraper({ delay: 1500 });

scraper.run();
