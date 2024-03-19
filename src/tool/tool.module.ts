import { Global, Module } from '@nestjs/common';
import { ToolService } from './tool.service';
import { ToolController } from './tool.controller';
// import { DatabaseModule } from 'src/database/database.module';

@Global()
@Module({
	//   imports: [DatabaseModule],
	controllers: [ToolController],
	providers: [ToolService],
	exports: [ToolService]
})
export class ToolModule {}
