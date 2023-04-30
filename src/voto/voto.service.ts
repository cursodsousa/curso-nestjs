import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { OpcaoVoto, Voto } from './voto.entity';
import { AssociadoService } from './associado/associado.service';
import { Pauta } from 'src/pautas/pauta.entity';
import { Result } from 'src/common/result';
import { Associado } from './associado/associado.entity';
import { HttpError } from 'src/common/httpError';

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
        opcaoVoto: OpcaoVoto) : Promise<Result<Voto, HttpError>> {

      if(!pauta.isFoiIniciada()){
        return new Result(null, new HttpError("Pauta não está em sessão.", HttpStatus.UNPROCESSABLE_ENTITY));
      }

      const associado: Associado = await this.associadoService.recuperarOuCadastrar(cpf);

      const votoJaRegistrado: boolean = await this.existeVotoPara(pauta, associado);

      if(votoJaRegistrado){
        return new Result(null, new HttpError("Voto já registrado anteriomente.", HttpStatus.CONFLICT));
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

    async resultado(pauta: Pauta) : Promise<void>{
        const votos = await this.buscarVotos(pauta);

        const votosSim = votos
            .filter(v => v.opcaoVoto == OpcaoVoto.SIM)
            .length

        const votosNao = votos
            .filter(v => v.opcaoVoto == OpcaoVoto.NAO)
            .length

        const posicaoVencedora = this.obterPosicaoGanhadora(votosSim, votosNao);

        console.log("Votos SIM ", votosSim);
        console.log("Votos N ", votosNao);
        console.log("posicaoVencedora", posicaoVencedora);
    }

    obterPosicaoGanhadora(sim: number, nao: number) : OpcaoVoto {
        if(nao == sim){
            return null;
        }

        return sim > nao ? OpcaoVoto.SIM : OpcaoVoto.NAO;
    }

    async buscarVotos(pauta: Pauta) : Promise<Voto[]> {
        return await this.votoRepository.find({
            where: {
                pauta: {
                    id: pauta.id
                }
            }
        })
    }
}
