import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DatabaseService } from './database/database.service';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	// TODO получается другого способа нет добраться до методов кроме как app.get из main.ts? А как это можно использовать app.get в других сервисах?
	const databaseService: DatabaseService = app.get(DatabaseService);

	// Глобальная проверка DTO
	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			forbidNonWhitelisted: true,
			transform: true
		})
	);

	app.use(cookieParser());
	const startMessage =
		`nestApp start on port=${global.fileConfig.port} ` +
		`db3=${global.fileConfig.db3.host}:${global.fileConfig.db3.dbname} ` +
		`auth=${global.fileConfig.auth.host}:${global.fileConfig.auth.port} `;

	await app.listen(global.fileConfig.port, () => console.log(startMessage));

	// TODO Может есть другой патерн для этого?
	process.on('SIGINT', async () => {
		console.log('SIGINT. Close');
		await databaseService.closeMongoClient();
		process.exit(1);
	});

	process.on('SIGTERM', async () => {
		console.log('SIGTERM. Close');
		await databaseService.closeMongoClient();
		process.exit(1);
	});
}
bootstrap();
