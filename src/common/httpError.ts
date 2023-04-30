import { HttpStatus } from "@nestjs/common";

export class HttpError extends Error {
    constructor(message: string, public readonly status: HttpStatus){
        super(message);

        Object.setPrototypeOf(this, HttpError.prototype);
    }
}