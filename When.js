/*jshint esnext: true*/
class When extends Promise{

    constructor( executor ){
        super( executor );
    }

    static delay(ms){
        return this.resolve().delay(ms);
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
