import { Prisma } from "@prisma/client";

export const returnMedicationObject: Prisma.MedicationSelect = {
    id: true,
    name: true,
    description: true,
    price: true,
    manufacturer: true,
    photoUrl: true,
    createdAt: true,
};