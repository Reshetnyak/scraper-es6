/*jshint esnext: true*/

function throttledForEach(arr, fn, delay=1500, context=null ) {
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

export default throttledForEach;
