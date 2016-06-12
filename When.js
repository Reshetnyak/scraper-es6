/*jshint esnext: true*/
class When extends Promise{

    constructor( executor ){
        super( executor );
    }

    static delay(ms){
        return this.resolve().delay(ms);
    }

    static allSettled(promises){
        // Wrap each promise from array with promise which resolves in both cases, either resolved of rejected
        const wrap = promise => new this( (resolve, reject) => {
                return promise
                        .then( result => resolve( result ) )
                        .catch( reason => resolve( reason ) );
            });

        // Provide array of promises which can only be resolved
        return this.all( promises.map( wrap ) );
    }

    static makeDelayedSequense(arr, fn, delay=(Math.random()*1000), context=null){

        return arr.reduce( (sequence, el) => {

           return sequence.delay(delay).then( fn.bind(context, el) );

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

module.exports = When;
