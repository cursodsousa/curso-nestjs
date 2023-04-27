import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { OpcaoVoto, Voto } from './voto.entity';
import { AssociadoService } from './associado/associado.service';
import { Pauta } from 'src/pautas/pauta.entity';
import { Result } from 'src/common/result';
import { Associado } from './associado/associado.entity';

@Injectable()
export class VotoService {
    constructor(
        @Inject('VOTO_REPOSITORY')
        private readonly votoRepository: Repository<Voto>,
        private readonly associadoService: AssociadoService
    ){}
    
    async registrarVoto(
        pauta: Pauta, 
        cpf: string, 
        opcaoVoto: OpcaoVoto) : Promise<Result<Voto>> {

      if(!pauta.isFoiIniciada()){
        return new Result(null, new Error("Pauta não está em sessão."));
      }

      const associado: Associado = await this.associadoService.recuperarOuCadastrar(cpf);

      const votoJaRegistrado: boolean = await this.existeVotoPara(pauta, associado);

      if(votoJaRegistrado){
        return new Result(null, new Error("Voto já registrado anteriomente."));
      }

      const voto = new Voto();
      voto.associado = associado;
      voto.pauta = pauta;
      voto.opcaoVoto = opcaoVoto;

      await this.votoRepository.save(voto);
      return new Result(voto, null);
    }

    async existeVotoPara(pauta: Pauta, associado: Associado) : Promise<boolean> {
        const voto: Voto = await this.votoRepository.findOne({
            where: {
                pauta: {
                    id: pauta.id
                },
                associado: {
                    id: associado.id
                }
            }
        });

        return !!voto;
    }
}
