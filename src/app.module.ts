import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HelloController } from './hello.controller'
import { HelloService } from './hello.service';

@Module({
  imports: [],
  controllers: [AppController, HelloController],
  providers: [AppService, HelloService],
})
export class AppModule {}
