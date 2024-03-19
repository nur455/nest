import { Inject, Injectable } from '@nestjs/common';
import { Db, MongoClient } from 'mongodb';

@Injectable()
export class DatabaseService {
	private mongoClient3: MongoClient;
	private db3: Db;

	constructor(
		@Inject('DB3')
		db3Obj: {
			db3: Db;
			client3: MongoClient;
		}
	) {
		this.db3 = db3Obj.db3;
		this.mongoClient3 = db3Obj.client3;
	}

	async closeMongoClient() {
		this.mongoClient3.close();
	}

	async updateIndexes(collection: string) {
		// To be insert later...
		switch (collection) {
			case 'room':
				console.log('Update indexes', collection);
			case 'schedule':
				console.log('Update indexes', collection);
		}
	}
}
