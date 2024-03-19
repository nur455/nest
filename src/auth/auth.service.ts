import { Inject, Injectable } from '@nestjs/common';
import { Db, MongoClient } from 'mongodb';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
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
	async createUser(dto: AuthDto) {}
	async findUser(email: string) {}
}
