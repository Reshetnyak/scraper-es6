const When = require('./when');

class DB {
    constructor(options = {}){

        const defaults = {
            connection: 'url-to-data-base'
        };

        // set options
        this.options = Object.assign(defaults, options);
    }
    saveData(propData){
        console.info('From DB module: Save to DB');
        return When.resolve(true);
    }
}

module.exports = DB;