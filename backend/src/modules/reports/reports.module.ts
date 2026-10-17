import { Module } from '@nestjs/common';
import { ReportsController } from './reports.controller';
import { MedicalHistoriesModule } from '../medical-histories/medical-histories.module';
import { AppointmentsModule } from '../appointments/appointments.module';

@Module({
  imports: [MedicalHistoriesModule, AppointmentsModule],
  controllers: [ReportsController],
})
export class ReportsModule {}
