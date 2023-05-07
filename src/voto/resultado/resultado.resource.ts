import { OpcaoVoto } from "../voto.entity";

export class ResultadoVotacaoResource {
    pauta: string;
    abertura: Date;
    encerramento: Date;
    totalVotos: number;
    quantidadeSim: number;
    quantidadeNao: number;
    opcaoGanhadora: OpcaoVoto;
}