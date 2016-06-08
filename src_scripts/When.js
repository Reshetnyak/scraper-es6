/*jshint esnext: true*/
class When extends Promise{

    constructor( executor ){
        super( executor );
    }

    static delay(ms){
        return When.resolve().delay(ms);
    }

    static allSettled(promises){

        // Wrap each promise from array with promise which resolves in both cases, either resolved of rejected
        const wrap = promise => {
            return new When( (resolve, reject) => {
                return promise
                        .then( result => resolve( result ) )
                        .catch( reason => resolve( reason ) );
            });
        };

        // Provide array of promises which can only be resolved
        return When.all( promises.map( wrap ) );
    }

    static makeDelayedSequense(arr, fn, delay=(Math.random()*1000), context=null){

        return arr.reduce( (sequence, el) => {

           return sequence.delay(delay).then( fn.bind(context, el) );

        }, When.resolve());
    }

    static makeSequence(arr, fn, context=null){

        return arr.reduce( (sequence, el) => {

           return sequence.then( fn.bind(context, el) );

        }, When.resolve());
    }

    delay(ms){
        // Save original promise
        const promiseToDelay = this;

        // Change chain to new delayed promise with the same result as original has
        return new When( (resolve, reject) => {

            const resolveWithDelay = result => setTimeout( () => resolve(result), ms);

            const rejectWithDelay = reason => setTimeout( () => reject(reason), ms);

            //take value from origin promise
            promiseToDelay
                // resolve with the same result but with delay
                .then( resolveWithDelay )
                // or reject with the same result but with delay
                .catch( rejectWithDelay );
        });
    }
}

export default When;
