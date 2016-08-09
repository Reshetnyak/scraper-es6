const Parser  = require('./parser');
const Scraper = require('./scraper');
const DB      = require('./db');

const db = new DB();

const parser  = new Parser();
const scraper = new Scraper({
    limit: 2,
    delay: 300,
    parser,
    db
});
//const scraper = new Scraper({ delay: 1500 });

scraper.run();
