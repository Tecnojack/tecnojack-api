import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';

import { SystemController } from './presentation/http/system.controller.js';

@Module({
  imports: [TerminusModule],
  controllers: [SystemController],
})
export class SystemModule {}
