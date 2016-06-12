/*jshint esnext: true*/
const http = require('http');
const When = require('./When.js');

const request = (url, delay) => new When( (resolve, reject) => {

    setTimeout(()=>{
        http.get(url, handleResponse)
        .on('error', handleError);
    }, delay);

    function handleResponse(response){

        let data = '';

        response.on('data', chunk => data += chunk);
        response.on('end', () => resolve(data) );
    }

    function handleError(err){
        console.log('From request: ', err);
        reject(err);
    }
});

module.exports = request;
