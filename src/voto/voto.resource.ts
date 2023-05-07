import { OpcaoVoto } from "./voto.entity";
import { IsNotEmpty, IsIn } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class RegistroVotoResource {
    @ApiProperty()
    @IsNotEmpty({ message: "Campo CPF é obrigatório" })
    cpf: string;

    @IsNotEmpty({ message: "Campo Opção de Voto é obrigatório" })
    @IsIn([OpcaoVoto.NAO, OpcaoVoto.SIM], 
        { message: "Campo Opção Voto só poderá ter os valores SIM ou NAO" 
    })
    @ApiProperty({ example: 'SIM ou NAO' })
    opcaoVoto: OpcaoVoto;
}