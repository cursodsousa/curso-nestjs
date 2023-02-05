import { Controller, Get } from '@nestjs/common'
import { HelloService } from './hello.service';

@Controller()
export class HelloController {

    constructor(
        private service: HelloService
    ){}

    @Get("/hello")
    hello() : string {
        return this.service.hello("Fulano");
    }
}