import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HelloController } from './hello.controller'
import { HelloService } from './hello.service';
import { PeopleModule } from './people/people.module';
import { DatabaseModule } from './database/database.module';
import { PautasModule } from './pautas/pautas.module';
import { VotoModule } from './voto/voto.module';

@Module({
  imports: [PeopleModule, DatabaseModule, PautasModule, VotoModule],
  controllers: [AppController, HelloController],
  providers: [AppService, HelloService],
})
export class AppModule {}
