import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { OpcaoVoto, Voto } from './voto.entity';
import { AssociadoService } from './associado/associado.service';
import { Pauta } from 'src/pautas/pauta.entity';
import { Result } from 'src/common/result';
import { Associado } from './associado/associado.entity';
import { HttpError } from 'src/common/httpError';
import { ResultadoVotacaoResource } from './resultado/resultado.resource';

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

    async obterVotosPorPauta(pauta: Pauta) : Promise<Voto[]> {
        return await this.votoRepository.find({
            where: {
                pauta: {
                    id: pauta.id
                }
            }
        })
    }

    obterPosicaoVencedora(sim: number, nao: number) : OpcaoVoto {
        if(sim == nao){
            return null;
        }

        return sim > nao ? OpcaoVoto.SIM : OpcaoVoto.NAO;
    }

    async obterResultado(pauta: Pauta) : Promise<Result<ResultadoVotacaoResource, HttpError>> {
        if(!pauta.isFoiEncerrada()){
            return new Result(null, new HttpError("Resultado ainda não disponível", HttpStatus.NOT_FOUND));
        }

        const votos: Voto[] = await this.obterVotosPorPauta(pauta);

        const qtdSim = votos.filter(voto => voto.opcaoVoto == OpcaoVoto.SIM).length;
        const qtdNao = votos.filter(voto => voto.opcaoVoto == OpcaoVoto.NAO).length;


        const posicaoVencedora = this.obterPosicaoVencedora(qtdSim, qtdNao);

        const resultado = new ResultadoVotacaoResource();
        resultado.pauta = pauta.descricao;
        resultado.abertura = pauta.abertura;
        resultado.encerramento = pauta.fechamento;
        resultado.totalVotos = votos.length;
        resultado.quantidadeSim = qtdSim;
        resultado.quantidadeNao = qtdNao;
        resultado.opcaoGanhadora = posicaoVencedora;

        return new Result(resultado, null);
    }
}
