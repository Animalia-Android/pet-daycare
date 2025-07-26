'use server';

import { Pet } from '@/lib/types';

export async function addPet(formData) {
  console.log('Adding pet:', formData);
  // await prisma?.pet.create({
  //   data: pet,
  // });

  await prisma?.pet.create({
    data: {
      name: formData.get('name'),
      ownerName: formData.get('ownerName'),
      age: parseInt(formData.get('age')),
      imageUrl: formData.get('imageUrl'),
      notes: formData.get('notes'),
    },
  });
}
