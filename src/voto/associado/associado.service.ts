import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Associado } from './associado.entity';

@Injectable()
export class AssociadoService {
    constructor(
        @Inject('ASSOCIADO_REPOSITORY')
        private readonly associadoRepository: Repository<Associado>
    ){}

    async obterPorCpf(cpf: string) : Promise<Associado> {
        return await this.associadoRepository.findOne({
            where: {
                cpf: cpf
            }
        })
    }

    async recuperarOuCadastrar(cpf: string) : Promise<Associado> {
        const associadoEncontrado: Associado = await this.obterPorCpf(cpf);
        if(associadoEncontrado){
            return associadoEncontrado;
        }

        const novoAssociado = new Associado();
        novoAssociado.cpf = cpf;
        await this.associadoRepository.save(novoAssociado);
        return novoAssociado;
    }
}
