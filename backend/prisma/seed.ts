import { PrismaClient, UserType, StaffRole, PetGender, AppointmentStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  const passwordHash = await bcrypt.hash('password123', 10);

  // 1. Seed Users
  const adminUser = await prisma.user.upsert({
    where: { username: 'admin' },
    update: { password: passwordHash },
    create: {
      username: 'admin',
      password: passwordHash,
      type: UserType.ADMIN,
      role: StaffRole.ADMIN,
    },
  });

  const vetUser1 = await prisma.user.upsert({
    where: { username: 'vet_alejandro' },
    update: { password: passwordHash },
    create: {
      username: 'vet_alejandro',
      password: passwordHash,
      type: UserType.WORKER,
      role: StaffRole.VETERINARIAN,
    },
  });

  const vetUser2 = await prisma.user.upsert({
    where: { username: 'vet_lucia' },
    update: { password: passwordHash },
    create: {
      username: 'vet_lucia',
      password: passwordHash,
      type: UserType.WORKER,
      role: StaffRole.VETERINARIAN,
    },
  });

  const recepUser = await prisma.user.upsert({
    where: { username: 'recep_maria' },
    update: { password: passwordHash },
    create: {
      username: 'recep_maria',
      password: passwordHash,
      type: UserType.WORKER,
      role: StaffRole.RECEPTIONIST,
    },
  });

  const clientUser = await prisma.user.upsert({
    where: { username: 'client_carlos' },
    update: { password: passwordHash },
    create: {
      username: 'client_carlos',
      password: passwordHash,
      type: UserType.WORKER,
      role: StaffRole.CLIENT,
    },
  });

  console.log('✅ Users seeded');

  // 2. Staff Profiles
  const receptionist = await prisma.receptionist.upsert({
    where: { id_user: recepUser.id_user },
    update: {},
    create: {
      id_user: recepUser.id_user,
      names: 'Maria',
      last_names: 'Solis Perez',
      email: 'maria.solis@healthypets.com',
      phone_number: '+51 987654321',
    },
  });

  const vet1 = await prisma.veterinarian.upsert({
    where: { id_user: vetUser1.id_user },
    update: {},
    create: {
      id_user: vetUser1.id_user,
      names: 'Alejandro',
      last_names: 'Martinez Ruiz',
      number_license: 'CMVP-10293',
      specialty: 'General Medicine',
      email: 'alejandro.martinez@healthypets.com',
      phone_number: '+51 912345678',
    },
  });

  const vet2 = await prisma.veterinarian.upsert({
    where: { id_user: vetUser2.id_user },
    update: {},
    create: {
      id_user: vetUser2.id_user,
      names: 'Lucia',
      last_names: 'Fernandez Lopez',
      number_license: 'CMVP-20481',
      specialty: 'Surgery & Orthopedics',
      email: 'lucia.fernandez@healthypets.com',
      phone_number: '+51 923456789',
    },
  });

  console.log('✅ Staff profiles seeded');

  // 3. Services Catalog
  const svc1 = await prisma.service.upsert({
    where: { name: 'General Consultation' },
    update: {},
    create: {
      name: 'General Consultation',
      description: 'Complete medical checkup, vital signs, physical exam and preventive diagnosis.',
      price: 45.0,
    },
  });

  const svc2 = await prisma.service.upsert({
    where: { name: 'Veterinary Surgery' },
    update: {},
    create: {
      name: 'Veterinary Surgery',
      description: 'Surgical procedures performed under inhaled anesthesia and vital monitoring.',
      price: 250.0,
    },
  });

  const svc3 = await prisma.service.upsert({
    where: { name: 'Vaccination and Deworming' },
    update: {},
    create: {
      name: 'Vaccination and Deworming',
      description: 'Immunization plan, rabies/hexavalent boosters, and internal/external antiparasitics.',
      price: 35.0,
    },
  });

  await prisma.service.upsert({
    where: { name: 'Clinical Laboratory' },
    update: {},
    create: {
      name: 'Clinical Laboratory',
      description: 'Comprehensive blood biochemistry, hemogram, urinalysis, and microscopic cytology.',
      price: 70.0,
    },
  });

  console.log('✅ Services catalog seeded');

  // 4. Vaccines Catalog
  const vac1 = await prisma.vaccine.upsert({
    where: { name: 'Rabies Rabisin' },
    update: {},
    create: {
      name: 'Rabies Rabisin',
      description: 'Inactivated rabies virus vaccine for dogs and cats.',
      manufacturer: 'Boehringer Ingelheim',
      required_dose: 1,
    },
  });

  const vac2 = await prisma.vaccine.upsert({
    where: { name: 'Canine Sextuple (DHPPi/L)' },
    update: {},
    create: {
      name: 'Canine Sextuple (DHPPi/L)',
      description: 'Protection against Distemper, Hepatitis, Parvovirus, Parainfluenza and Leptospirosis.',
      manufacturer: 'Zoetis (Vanguard Plus 5)',
      required_dose: 3,
    },
  });

  console.log('✅ Vaccines catalog seeded');

  // 5. Owners
  const owner1 = await prisma.owner.upsert({
    where: { dni: '72849102' },
    update: {},
    create: {
      id_user: clientUser.id_user,
      dni: '72849102',
      names: 'Carlos',
      last_names: 'Mendoza Vargas',
      email: 'carlos.mendoza@gmail.com',
      phone_number: '+51 998877665',
      address: 'Av. Primavera 452, Santiago de Surco, Lima',
    },
  });

  const owner2 = await prisma.owner.upsert({
    where: { dni: '45892103' },
    update: {},
    create: {
      dni: '45892103',
      names: 'Valeria',
      last_names: 'Torres Quiroz',
      email: 'valeria.torres@hotmail.com',
      phone_number: '+51 977665544',
      address: 'Calle Los Sauces 120, Miraflores, Lima',
    },
  });

  console.log('✅ Owners seeded');

  // 6. Pets
  const existingPet1 = await prisma.pet.findFirst({
    where: { id_owner: owner1.id_owner, name: 'Max' },
  });
  const pet1 = existingPet1
    ? existingPet1
    : await prisma.pet.create({
        data: {
          id_owner: owner1.id_owner,
          name: 'Max',
          species: 'Canine',
          race: 'Golden Retriever',
          birthdate: new Date('2021-05-14'),
          pet_gender: PetGender.MALE,
          weight: '28.5 kg',
        },
      });

  const existingPet2 = await prisma.pet.findFirst({
    where: { id_owner: owner1.id_owner, name: 'Luna' },
  });
  const pet2 = existingPet2
    ? existingPet2
    : await prisma.pet.create({
        data: {
          id_owner: owner1.id_owner,
          name: 'Luna',
          species: 'Feline',
          race: 'Siamese',
          birthdate: new Date('2022-09-20'),
          pet_gender: PetGender.FEMALE,
          weight: '4.2 kg',
        },
      });

  console.log('✅ Pets seeded');

  // 7. Appointments & Medical History
  const existingApp1 = await prisma.appointment.findFirst({
    where: { id_pet: pet1.id_pet, id_veterinarian: vet1.id_veterinarian },
  });
  const app1 = existingApp1
    ? existingApp1
    : await prisma.appointment.create({
        data: {
          id_receptionist: receptionist.id_receptionist,
          id_pet: pet1.id_pet,
          id_veterinarian: vet1.id_veterinarian,
          date: new Date('2026-10-10T10:00:00Z'),
          time_minutes: 30,
          reason: 'Annual vaccination and general checkup',
          notes: 'Owner reports good appetite and normal activity.',
          status: AppointmentStatus.CLOSED,
        },
      });

  const existingMh1 = await prisma.medicalHistory.findUnique({
    where: { id_appointment: app1.id_appointment },
  });
  const mh1 = existingMh1
    ? existingMh1
    : await prisma.medicalHistory.create({
        data: {
          id_appointment: app1.id_appointment,
          id_service: svc3.id_service,
          description:
            'Patient presented in optimal nutritional condition. Administered annual Rabies and Hexavalent vaccine.',
          date: new Date('2026-10-10T10:30:00Z'),
        },
      });

  // 8. Vaccinations
  const existingVac1 = await prisma.vaccination.findFirst({
    where: { id_medical_history: mh1.id_medical_history, id_vaccine: vac1.id_vaccine },
  });
  if (!existingVac1) {
    await prisma.vaccination.create({
      data: {
        id_medical_history: mh1.id_medical_history,
        id_vaccine: vac1.id_vaccine,
        application_date: new Date('2026-10-10T10:30:00Z'),
        next_application_date: new Date('2027-10-10T10:30:00Z'),
        observation: 'Annual Rabies booster applied subcutaneously.',
      },
    });
  }

  console.log('✅ Appointments, Medical History, and Vaccinations seeded');
  console.log('🎉 Seeding successfully completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
