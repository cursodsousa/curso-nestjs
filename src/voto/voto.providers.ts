import { Provider } from '@nestjs/common'
import { DataSource, Repository } from 'typeorm'
import { Voto } from './voto.entity'
import { Associado } from './associado/associado.entity'

const votoRepository: Provider<Repository<Voto>> = {
    provide: 'VOTO_REPOSITORY',
    useFactory: (dataSource: DataSource) => {
        return dataSource.getRepository(Voto);
    },
    inject: ['DATA_SOURCE']
}

const associadoRepository: Provider<Repository<Associado>> = {
    provide: 'ASSOCIADO_REPOSITORY',
    useFactory: (dataSource: DataSource) => {
        return dataSource.getRepository(Associado);
    },
    inject: ['DATA_SOURCE']
}

export const votoProviders: Provider[] = [ votoRepository, associadoRepository ]