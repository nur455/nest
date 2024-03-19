import { ObjectId } from 'mongodb';
import { createInfo } from 'src/tool/tool.interface';

export class File {}

export class FileUploadClass {
	uploadName: string;
	fileId: ObjectId;
	backet: string;
	isDeleted: boolean;
	createInfo: createInfo;
	constructor(options: FileUploadClass) {
		// console.log('++++ options', options);
		this.uploadName = options.uploadName;
		this.backet = options.backet;
		this.isDeleted = options.isDeleted;
		this.fileId = new ObjectId(options.fileId);
		// this.createInfo = {
		//   createDate: new Date(options.createInfo.createDate),
		//   userId: new ObjectId(options.createInfo.userId),
		//   userName: options.createInfo.userName
		// };
	}
}
