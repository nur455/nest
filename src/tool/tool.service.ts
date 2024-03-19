import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Collection, Db, GridFSBucket } from 'mongodb';
import { ProcErrReocrd, ProcLog, ProcLogReocrd } from './tool.interface';

@Injectable()
export class ToolService {
	private db3: Db;
	private module: string;
	private collection: Collection<Document>;
	private errStrCol: Collection<Document>;

	// TODO кажется, что коряво так писать - db3Obj: any
	constructor(@Inject('DB3') db3Obj: any) {
		this.db3 = db3Obj.db3;
		this.module = 'nest-main';

		// TODO Может лучше тут объявить коллекции, а в методах использовать как private переменную?
		this.collection = this.db3.collection('logger');
		this.errStrCol = this.db3.collection('errStr'); // Коллекция errStr в db3
	}

	async writeProcLog(procLog: ProcLog, message: string, time?: number) {
		const logReocrd: ProcLogReocrd = {
			type: 'info',
			procId: procLog.procId,
			module: this.module,
			source: procLog.source,
			message: message,
			createDate: new Date(),
			// time: time,
			remoteIp: procLog.remoteIp
			// user: procLog.user
		};
		if (time) logReocrd.time = time;
		if (global.config.common.isConsoleLog) {
			let logMessage =
				`${logReocrd.createDate.toJSON()} ` +
				`type=${logReocrd.type} ` +
				`module='${logReocrd.module}' ` +
				`source='${logReocrd.source}' ` +
				`procId=${logReocrd.procId} ` +
				`message='${logReocrd.message}`;

			if (time) {
				logMessage += ` time=${logReocrd.time}`;
			}
			console.log(logMessage);
		}
		const collection = this.db3.collection('logger'); // TODO Можно использовать как private для всего класса?
		try {
			await collection.insertOne(logReocrd);
		} catch (err) {
			throw new HttpException(
				{
					status: HttpStatus.SERVICE_UNAVAILABLE,
					error: `Ошибка при работе writeProcLog записи в базу данных.Обратитесь позднее.err = ${err} `
				},
				HttpStatus.SERVICE_UNAVAILABLE
			);
		}
	}

	async writeProcErrLog(procLog: ProcLog, errStr: string, errDetailStr: string, errBody: string = null) {
		const errReocrd: ProcErrReocrd = {
			type: 'error',
			procId: procLog.procId,
			// remoteIp: procLog.remoteIp,
			// user: procLog.user
			module: this.module,
			source: procLog.source,
			errStr: errStr,
			errDetailStr: errDetailStr,
			errBody: errBody,
			createDate: new Date()
		};
		if (global.config.common.isConsoleLog) {
			const errMessage =
				`${errReocrd.createDate.toJSON()} ` +
				`type=${errReocrd.type} ` +
				`module='${errReocrd.module}' ` +
				`source='${errReocrd.source}' ` +
				`procId=${errReocrd.procId} ` +
				`errStr='${errReocrd.errStr}' ` +
				`errDetailStr='${errReocrd.errDetailStr}'`;

			console.log(errMessage);
		}
		const collection = this.db3.collection('logger');
		try {
			await collection.insertOne(errReocrd);
		} catch (err) {
			throw new HttpException(
				{
					status: HttpStatus.SERVICE_UNAVAILABLE,
					error: `Ошибка при работе logger записи в базу данных. Обратитесь позднее. err=${err}`
				},
				HttpStatus.SERVICE_UNAVAILABLE
			);
		}
	}

	async getErrTranslate(errStr: string, lng: string) {
		let res;
		try {
			// return (await this.errStrCol.findOne({ errStr: errStr, isDeleted: false }))[lng];
			res = (await this.errStrCol.findOne({ errStr: errStr, isDeleted: false }))[lng];
		} catch (err) {
			return false;
		}
		return res;
	}

	async sendProcTranslateError(procLog: ProcLog, errStr: string, errDetailStr: string, errBody: string = null) {
		let errStrTranslate = `${errStr} (Без перевода)`;
		const translate = await this.getErrTranslate(errStr, procLog.user.interfaceLang);
		if (translate) errStrTranslate = translate;
		await this.writeProcErrLog(procLog, errStr, errDetailStr, errBody);
		throw new HttpException(
			{
				status: HttpStatus.SERVICE_UNAVAILABLE,
				error: errStrTranslate,
				detail: `module:${this.module} source:${procLog.source} procId:${procLog.procId} errDetailStr:'${errDetailStr}'`
			},
			HttpStatus.SERVICE_UNAVAILABLE
		);
	}

	// Функция утилита, записывает в монго буфер, возвращает id из базы данных. bucketName - имя коллекции, куда писать
	async dbWriteFile(bucketName: string, buffer: Buffer, fileName: string): Promise<string> {
		// TODO вставить проверку на upload user
		// console.log('fileName', fileName);
		const bucket = new GridFSBucket(this.db3, {
			bucketName: bucketName
		});

		// Можно добавить в bucket.files metadata
		// let uploadStream = bucket.openUploadStream(fileName, { chunkSizeBytes: null, metadata: { speaker: 'Bill Gates', duration: '1hr' }, contentType: null, aliases: null });
		const uploadStream = bucket.openUploadStream(fileName);

		uploadStream.write(buffer);
		uploadStream.end();

		return new Promise((resolve, reject) => {
			// uploadStream.on('finish', resolve);
			uploadStream.on('finish', () => {
				// console.log('id', uploadStream.id);
				const ret = { fileId: uploadStream.id.toString() };
				// resolve(uploadStream.id.toString());
				resolve(JSON.stringify(ret));
			});
			uploadStream.on('error', reject);
		});
	}
}
