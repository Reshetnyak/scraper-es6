/*jshint esnext: true*/
const http = require('http');

const request = url => {

    const promise = new Promise( (resolve, reject) => {

        http.get(url, handleResponse)
            .on('error', (err) => {
                console.log('From request: ', err);
                reject(err);
            });

        function handleResponse(response){

            let data = '';

            response.on('data', chunk => data += chunk);
            response.on('end', () => resolve(data) );
        }
    });

    return promise;
};

module.exports = request;
