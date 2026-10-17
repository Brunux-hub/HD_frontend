import { Module } from '@nestjs/common';
import { ReceptionistsService } from './receptionists.service';
import { ReceptionistsController } from './receptionists.controller';

@Module({
  controllers: [ReceptionistsController],
  providers: [ReceptionistsService],
  exports: [ReceptionistsService],
})
export class ReceptionistsModule {}
