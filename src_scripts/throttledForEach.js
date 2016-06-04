/*jshint esnext: true*/

function throttledForEach(arr, fn, delay=1500, context=null ) {
    let i = 0;
    let finished = new Promise((resolve,reject)=>{
        tick();

        function tick() {

            let promise = new Promise(
                (resolve,reject)=>{
                    fn.apply(context, [arr[i], i, arr, {resolve, reject}]);
                }
            );

            promise
                .then( n => {
                    let isFinished = (i += 1, i === arr.length);

                    isFinished ? resolve() : setTimeout(tick, delay);

                })
                .catch(e=>console.error(e));
        }
    });
    return finished;
}

export default throttledForEach;
