export class Result<T, E> {
    constructor(
        public value: T, 
        public error: E
    ){}

    isError(){
        return !!this.error;
    }
}