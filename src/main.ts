import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function seedDoctorsAndReviews() {
  // const doctorsToCreate = 10; // Количество докторов
  // const reviewsPerDoctor = 5; // Количество отзывов на доктора

  // for (let i = 0; i < doctorsToCreate; i++) {
  //   // Создаем доктора
  //   const doctor = await prisma.user.create({
  //     data: {
  //       name: faker.person.fullName(),
  //       phoneNumber: faker.phone.number({ style: "human" }),
  //       role: "doctor",
  //       avatarUrl: faker.image.avatar(),
  //       address: faker.location.streetAddress(),
  //       birthday: faker.date.birthdate({ min: 30, max: 60, mode: 'age' }),
  //       profession: "Doctor",
  //       specialty: faker.helpers.arrayElement(["Therapist", "Surgeon", "Pediatrician", "Dentist"]),
  //       workHours: "9:00 - 18:00",
  //       rating: faker.number.float({ min: 3.5, max: 5, fractionDigits: 1 }),
  //     },
  //   });

  //   console.log(`Created doctor: ${doctor.name} (ID: ${doctor.id})`);

  //   // Создаем отзывы для доктора
  //   for (let j = 0; j < reviewsPerDoctor; j++) {
  //     const patient = await prisma.user.create({
  //       data: {
  //         name: faker.person.fullName(),
  //         phoneNumber: faker.phone.number({ style: "human" }),
  //         role: "patient",
  //         birthday: faker.date.birthdate({ min: 20, max: 40, mode: 'age' }),
  //       },
  //     });

  //     const review = await prisma.review.create({
  //       data: {
  //         content: faker.lorem.sentences(2),
  //         rating: faker.number.int({ min: 1, max: 5 }),
  //         userId: patient.id,
  //         doctorId: doctor.id,
  //       },
  //     });

  //     console.log(`Created review: ${review.content} for Doctor ID: ${doctor.id}`);
  //   }
  // }

  // console.log("Seeding complete.");

  const users = await Promise.all(
    Array.from({ length: 10 }).map(async () => {
      const role = faker.helpers.arrayElement(["patient", "doctor", "admin"]);
      const user = await prisma.user.create({
        data: {
          name: faker.person.fullName(),
          phoneNumber: faker.phone.number({ style: "human" }),
          role,
          avatarUrl: faker.image.avatar(),
          address: faker.location.streetAddress(),
          birthday: faker.date.past({ years: 18 }),
          profession: role === "doctor" ? faker.person.jobType() : null,
          specialty: role === "doctor" ? faker.person.jobArea() : null,
          workHours: role === "doctor" ? "9:00 - 18:00" : null,
          rating: role === "doctor" ? faker.number.float({ min: 3.5, max: 5, fractionDigits: 1 }) : null,
        },
      });
      return user;
    })
  );

  // Генерация медикаментов
  const medications = await Promise.all(
    Array.from({ length: 10 }).map(async () => {
      return await prisma.medication.create({
        data: {
          name: faker.commerce.productName(),
          description: faker.commerce.productDescription(),
          composition: faker.lorem.words(5),
          indications: faker.lorem.sentences(2),
          usageMethod: faker.lorem.sentence(),
          contraindications: faker.lorem.sentences(1),
          sideEffects: faker.lorem.sentence(),
          price: faker.number.float({ min: 10, max: 100, fractionDigits: 2 }),
          manufacturer: faker.company.name(),
          photoUrl: faker.image.urlPicsumPhotos(),
          isOnSale: faker.datatype.boolean(),
          stockQuantity: faker.number.int({ min: 0, max: 1000 }),
        },
      });
    })
  );

  // Генерация расписаний для медикаментов
  for (let i = 0; i < 10; i++) {
    const user = users[i % users.length];
    const medication = medications[i % medications.length];

    if (user.role === "patient") {
      await prisma.medicationSchedule.create({
        data: {
          userId: user.id,
          medicationId: medication.id,
          scheduleTime: faker.date.future(),
          status: faker.helpers.arrayElement(["taken", "missed", "pending", "skipped"]),
        },
      });
    }
  }

  // Генерация записей на прием
  for (let i = 0; i < 10; i++) {
    const patient = users.find((u) => u.role === "patient");
    const doctor = users.find((u) => u.role === "doctor");

    if (patient && doctor) {
      await prisma.appointment.create({
        data: {
          userId: patient.id,
          doctorId: doctor.id,
          clinicAddress: faker.location.streetAddress(),
          appointmentDate: faker.date.future(),
          serviceType: faker.lorem.word(),
          price: faker.number.float({ min: 50, max: 500, fractionDigits: 2 }),
          status: faker.helpers.arrayElement(["scheduled", "completed", "cancelled"]),
          paymentMethod: faker.helpers.arrayElement(["card", "cash"]),
        },
      });
    }
  }

  // Генерация заказов
  for (let i = 0; i < 10; i++) {
    const user = users.find((u) => u.role === "patient");

    if (user) {
      const order = await prisma.order.create({
        data: {
          userId: user.id,
          totalPrice: faker.number.int({ min: 50, max: 500 }),
          status: faker.helpers.arrayElement(["pending", "shipped", "delivered"]),
        },
      });

      await prisma.orderItem.create({
        data: {
          orderId: order.id,
          medicationId: medications[i % medications.length].id,
          quantity: faker.number.int({ min: 1, max: 5 }),
          price: faker.number.float({ min: 10, max: 50, fractionDigits: 2 }),
        },
      });
    }
  }

  // Генерация OTP
  for (let i = 0; i < 10; i++) {
    const user = users.find((u) => u.role === "patient");

    if (user) {
      await prisma.oTP.create({
        data: {
          phoneNumber: user.phoneNumber,
          otpCode: faker.number.int({ min: 100000, max: 999999 }).toString(),
          expiresAt: faker.date.future(),
          verified: faker.datatype.boolean(),
          userId: user.id,
        },
      });
    }
  }

  console.log("Данные успешно сгенерированы!");
}

async function generateChatMessages() {
  const messages = [];
  const totalMessages = 10000;
  const words = faker.lorem.words(100000).split(' '); // Генерация 100000 слов

  for (let i = 0; i < totalMessages; i++) {
    const senderId = Math.floor(Math.random() * 91) + 1;  // ID отправителя от 1 до 91
    const receiverId = Math.floor(Math.random() * 91) + 1;  // ID получателя от 1 до 91
    const messageText = words.slice(i * 10, (i + 1) * 10).join(' ');  // Составляем сообщение из 10 слов
    const attachmentUrl = Math.random() > 0.8 ? faker.image.dataUri() : null;  // 20% вероятность прикрепленного файла

    messages.push({
      senderId,
      receiverId,
      messageText,
      attachmentUrl,
      sentAt: faker.date.past(),  // Случайное время из прошлого
    });
  }

  // Вставка данных в базу данных
  try {
    const result = await prisma.chatMessage .createMany({
      data: messages,
    });
    console.log(`${result.count} messages inserted successfully.`);
  } catch (error) {
    console.error('Error inserting messages:', error);
  } finally {
    await prisma.$disconnect();
  }
}


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.enableCors()
  await app.listen(process.env.PORT ?? 4200);

  // generateChatMessages();


  // seedDoctorsAndReviews()
  // .catch((e) => {
  //   console.error(e);
  //   process.exit(1);
  // })
  // .finally(async () => {
  //   await prisma.$disconnect();
  // });
}


bootstrap();
