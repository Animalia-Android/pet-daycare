'use server';

import { Pet } from '@/lib/types';

export async function addPet(pet: Pet) {
  await prisma?.pet.create({
    data: pet,
  });
}
