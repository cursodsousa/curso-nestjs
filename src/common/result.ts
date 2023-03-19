export class Result<T> {
    constructor(
        public value: T, 
        public error: Error
    ){}

    isError(){
        return !!this.error;
    }
}