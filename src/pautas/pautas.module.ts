import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module'
import { PautasService } from './pautas.service';
import { PautasController } from './pautas.controller';
import { pautaProviders } from './pauta.providers';

@Module({
    imports: [DatabaseModule],
    providers: [PautasService, ...pautaProviders],
    controllers: [PautasController]
})
export class PautasModule {}
