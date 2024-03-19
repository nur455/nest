import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ToolModule } from './tool/tool.module';
import { AuthModule } from './auth/auth.module';
import { ProductModule } from './product/product.module';
import { ScheduleModule } from './schedule/schedule.module';
import { RoomModule } from './room/room.module';
import { UsersModule } from './users/users.module';
import { FileModule } from './file/file.module';

/*
TODO не могу понять, где задается порядок инициализации модулей
	[Nest] 480778  - 03/16/2024, 1:26:43 AM     LOG [NestFactory] Starting Nest application...
	[Nest] 480778  - 03/16/2024, 1:26:43 AM     LOG [InstanceLoader] AppModule dependencies initialized +23ms
	[Nest] 480778  - 03/16/2024, 1:26:43 AM     LOG [InstanceLoader] AuthModule dependencies initialized +1ms
	[Nest] 480778  - 03/16/2024, 1:26:43 AM     LOG [InstanceLoader] ProductModule dependencies initialized +0ms
	[Nest] 480778  - 03/16/2024, 1:26:43 AM     LOG [InstanceLoader] ScheduleModule dependencies initialized +0ms
	[Nest] 480778  - 03/16/2024, 1:26:43 AM     LOG [InstanceLoader] RoomModule dependencies initialized +0ms
	[Nest] 480778  - 03/16/2024, 1:26:46 AM     LOG [InstanceLoader] DatabaseModule dependencies initialized +2611ms
	[Nest] 480778  - 03/16/2024, 1:26:46 AM     LOG [InstanceLoader] ToolModule dependencies initialized +1ms
	[Nest] 480778  - 03/16/2024, 1:26:46 AM     LOG [RoutesResolver] ToolController {/tool}: +160ms
	[Nest] 480778  - 03/16/2024, 1:26:46 AM     LOG [NestApplication] Nest application successfully started +3ms
*/

@Module({
	imports: [DatabaseModule, ToolModule, AuthModule, ProductModule, ScheduleModule, RoomModule, UsersModule, FileModule]
})
export class AppModule {}
