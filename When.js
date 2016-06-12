/*jshint esnext: true*/
class When extends Promise{

    constructor( executor ){
        super( executor );
    }

    static delay(ms=(Math.random()*1000)){
        return this.resolve().delay(ms);
    }

    static resolveDelayed(val, ms=(Math.random()*1000)){
        return When.resolve(val).delay(ms);
    }

    // Wrap promise which will be resolved in both cases, either resolve of reject of called promise
    static resolveInBothCases(promise ){
        return new this( (resolve, reject) => {
            return promise
                .then( result => resolve(
                    { value: result, resolved: true }
                ))
                .catch( reason => resolve(
                    { reason, rejected: true }
                ));
        });
    }

    static allSettled( promises ){
        // Wrap promise which will be resolved in both cases, either resolve of reject of called promise
        const wrappedPromises = promises.map(
            promise => this.resolveInBothCases( promise )
        );

        return this.all( wrappedPromises );
    }

    static makeDelayedSequense(arr, fn, delayMs=(Math.random()*1000), context=null){

        return arr.reduce( (sequence, el) => {

           return sequence.delay( delayMs ).then( fn.bind(context, el) );

        }, this.resolve());
    }

    static makeSequence(arr, fn, context=null){

        return arr.reduce( (sequence, el) => {

           return sequence.then( fn.bind(context, el) );

        }, this.resolve());
    }

    static async(makeGenerator){

        return (...args) => {
            const generator = makeGenerator.apply(this, args);

            const handle = result => {

                if (result.done){
                    return Promise.resolve( result.value )
                }

                return Promise.resolve( result.value )
                    .then( res => handle( generator.next(res) ) )
                    .catch( reason => handle( generator.throw(reason) ) );
            }

            try {
                return handle( generator.next() );
            } catch (reason) {
                return Promise.reject(reason);
            }
        }
    }

    delay(ms=(Math.random()*1000)){

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

module.exports = When;
