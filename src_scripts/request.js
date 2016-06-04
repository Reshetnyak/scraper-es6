/*jshint esnext: true*/
import http from 'http';

let request = url => {

    let promise = new Promise( (resolve, reject) => {

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

export default request;
