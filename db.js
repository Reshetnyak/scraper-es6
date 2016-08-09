const When = require('./when');

class DB {
    constructor(){}
    saveData(propData){
        console.info('From DB module: Save to DB');
        return When.resolve(true);
    }
}

module.exports = DB;