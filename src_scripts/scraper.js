/*jshint esnext: true*/
import request from './request.js';
import throttledForEach from './throttledForEach.js';

console.info(request);

var arr = [1, 2, 3, 4, 5];

throttledForEach(arr, log).then(()=> console.warn('succeeded!!!'));

function log(item, i, arr, promise) {

    console.log('outer started :', item, i, arr);

    var innerArr = Array.apply(null , Array(item)).map((n,i)=>i + 1);

    throttledForEach(innerArr, logInner).then(
        () => { promise.resolve('outer finished'); }
    );
}

function logInner(item, i, arr, promise) {

    console.info('inner started: ', item, i, arr);

    promise.resolve('inner finished');
}
