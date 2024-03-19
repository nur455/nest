import { Global, Module } from '@nestjs/common';
import { Db, MongoClient, ServerApiVersion } from 'mongodb';
import { readFileSync } from 'fs';
import { DatabaseService } from './database.service';

@Global()
@Module({
	providers: [
		{
			// TODO Не ясна до конца конструкция: useFactory: (otherService: OtherSerice) {return ...} inject: [Otherservice]
			// TODO Почему бы не использовать сервис для подключения к базе? Не могу понять, ведь используя сервис можно подключиться, вернуть подключение и использовать в других сервисах и контроллерах
			provide: 'DB3',
			useFactory: async (): Promise<{ db3: Db; client3: MongoClient }> => {
				const configFile = readFileSync('./config/config.json', 'utf-8');
				const fileConfig = JSON.parse(configFile);
				const uri =
					`mongodb+srv://${fileConfig.db3.user}:${fileConfig.db3.password}@${fileConfig.db3.host}` +
					`/?retryWrites=true&w=majority&appName=Cluster0`;

				const client3 = new MongoClient(uri, {
					serverApi: {
						version: ServerApiVersion.v1,
						strict: true,
						deprecationErrors: true
					}
				});

				let db3: Db;
				try {
					await client3.connect();
					await client3.db('admin').command({ ping: 1 });
					db3 = client3.db(fileConfig.db3.dbname);
				} catch (err) {
					// TODO Не уверен что делаю верно. В проекте используется свой логгер, который работает с БД. Но тут еще нет подключения к БД, поэтому new Error
					throw new Error(`Error connect to DB3. err=${err}`);
				}

				// TODO Create global variables. Считаю использование тут глобальных переменных оправдано... Или я не прав?
				global.fileConfig = fileConfig;
				try {
					global.config = await db3.collection('config').findOne({ type: 'config', isDeleted: false });
				} catch (err) {
					throw new Error(`Error read config first time. err=${err}`);
				}
				// console.log('global.config', global.config);
				global.agrOption = { allowDiskUse: true };
				return { db3: db3, client3: client3 };
			}
		},
		DatabaseService
	],
	exports: ['DB3', DatabaseService]
})
export class DatabaseModule {}
