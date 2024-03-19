import { Inject, Injectable } from '@nestjs/common';
import { Db, WithId } from 'mongodb';
import { ProcLog } from 'src/tool/tool.interface';
import { ToolService } from 'src/tool/tool.service';
import { Users } from './users.interface';

@Injectable()
export class UsersService {
	private db3: Db;
	constructor(
		@Inject('BIL3DB') db3Obj: any,
		private toolService: ToolService
	) {
		this.db3 = db3Obj.db3;
	}

	// Проверить пустой body.account
	async getUserByName(name: string, user: Users, remoteIp: string, procId?: number) {
		// Счетчик выполнения запроса целиком
		const startTime = Date.now();
		// для writeProcLog
		const source = 'getUserByName'; // Константа для этой функции в логах
		let errStr: string;
		let errDetailStr: string;
		let res: any;
		if (!procId) procId = Math.floor(Math.random() * 1e6); // Вставляем этот procId чтобы в логах удобнее смотреть запущенный процесс
		const procLog: ProcLog = {
			source: source,
			remoteIp: remoteIp,
			user: user,
			procId: procId
		};
		// Коллекции
		const usersCol = this.db3.collection('users');

		try {
			res = await usersCol.findOne({ name: name }, { projection: { _id: 1 } });
		} catch (err) {
			errStr = `Обратитесь в службу поддержки. Ошибка базы данных`;
			let errStrTranslate = `${errStr} (Без перевода)`;
			const translate = await this.toolService.getErrTranslate(errStr, procLog.user.interfaceLang);
			if (translate) errStrTranslate = translate;
			errDetailStr = `err=${err}`;
			await this.toolService.sendProcTranslateError(procLog, errStr, errStrTranslate, errDetailStr);
		}

		// Счетчик выполнения запроса целиком
		const endTime = Date.now();
		const totalTime = endTime - startTime;
		const message = `Finish ${source} for ${totalTime} msec`;
		await this.toolService.writeProcLog(procLog, message, totalTime);

		return { exists: false };
	}
}
