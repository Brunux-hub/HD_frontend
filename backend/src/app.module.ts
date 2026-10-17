import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { OwnersModule } from './modules/owners/owners.module';
import { PetsModule } from './modules/pets/pets.module';
import { ReceptionistsModule } from './modules/receptionists/receptionists.module';
import { VeterinariansModule } from './modules/veterinarians/veterinarians.module';
import { ServicesModule } from './modules/services/services.module';
import { AppointmentsModule } from './modules/appointments/appointments.module';
import { MedicalHistoriesModule } from './modules/medical-histories/medical-histories.module';
import { VaccinesModule } from './modules/vaccines/vaccines.module';
import { VaccinationsModule } from './modules/vaccinations/vaccinations.module';
import { ReportsModule } from './modules/reports/reports.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    OwnersModule,
    PetsModule,
    ReceptionistsModule,
    VeterinariansModule,
    ServicesModule,
    AppointmentsModule,
    MedicalHistoriesModule,
    VaccinesModule,
    VaccinationsModule,
    ReportsModule,
  ],
})
export class AppModule {}
