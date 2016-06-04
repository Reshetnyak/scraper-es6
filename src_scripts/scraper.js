/*jshint esnext: true*/
import request from './request.js';

console.info(request);

function throtteledForEach(arr, fn, delay=1500, context=null ) {
    var i = 0;
    var finished = new Promise((resolve,reject)=>{
        tick();

        function tick() {
            if (i == arr.length) {
                resolve();
            } else {
                var promise = new Promise(
                    (resolve,reject)=>{
                        fn.apply(context, [arr[i], i, arr, {resolve, reject}])
                    }
                );

                promise
                    .then(n=>{
                        i += 1;
                        console.log('in throtteled resolve: ', n);
                        setTimeout(tick, delay);
                    })
                    .catch(e=>console.error(e));
            }
        }
    }
    );
    return finished;
}

var arr = [1, 2, 3, 4, 5];

throtteledForEach(arr, log).then(()=> console.warn('succeeded!!!'));

function log(item, i, arr, promise) {

    console.log('outer started :', item, i, arr);

    var innerArr = Array.apply(null , Array(item)).map((n,i)=>i + 1);

    throtteledForEach(innerArr, logInner).then(
        () => { promise.resolve('outer finished'); }
    );

}

function logInner(item, i, arr, promise) {

    console.info('inner started: ', item, i, arr);

    promise.resolve('inner finished');
}
