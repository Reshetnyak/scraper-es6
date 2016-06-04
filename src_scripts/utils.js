/*jshint esnext: true*/
const utils = {
    range(start, numOfElements, step = 1){
        return Array.apply(null, {length: numOfElements}).map( (n, i) => start + (i * step) );
    }
};

export default utils;
