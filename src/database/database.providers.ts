import { Provider } from '@nestjs/common';
import { DataSource } from 'typeorm'

export const dataBaseProviders: Provider[] = [
    {
        provide: 'DATA_SOURCE',
        useFactory: async () => {            
            const dataSource = new DataSource({
                type: 'mysql',
                host: 'assembleia-mysql',
                port: 3306,
                username: 'root',
                password: 'root',
                database: 'assembleia',
                entities: [
                    __dirname + '/../**/*.entity{.ts,.js}'
                ],
                synchronize: true
            });

            return dataSource.initialize();
        }
    }
] 