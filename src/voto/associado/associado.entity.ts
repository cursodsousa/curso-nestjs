import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity()
export class Associado {
    
    @PrimaryGeneratedColumn()
    id?: string;

    @Column()
    cpf: string;
}