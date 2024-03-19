// export interface Tool {}

import { ObjectId } from 'mongodb';
import { User } from 'src/auth/auth.interface';
import { Users } from 'src/users/users.interface';

// proc - это процесс.
// source - контейнер, например agis-bil3-main
export interface ProcLog {
	source: string;
	remoteIp: string;
	user?: Users;
	procId?: number;
}

// Запись в базу, тип info
// module - функция, например addAbonent
export interface ProcLogReocrd {
	type: string;
	procId: number;
	module: string;
	source: string;
	message: string;
	createDate: Date;
	time?: number;
	remoteIp: string;
	// user: User;
}

// Запись в базу, тип error
// module - функция, например addAbonent
export interface ProcErrReocrd {
	type: string;
	procId: number;
	module: string;
	source: string;
	errStr: string;
	errDetailStr: string;
	errBody: string;
	createDate: Date;
	// remoteIp: string;
	// user: User;
}

export interface createInfo {
	createDate: Date;
	userId: ObjectId;
	userName: string;
}
