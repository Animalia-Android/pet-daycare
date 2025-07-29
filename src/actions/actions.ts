'use server';

import { PetEssentials } from '@/lib/types';
import { sleep } from '@/lib/utils';
import { Pet } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export async function addPet(petData: PetEssentials) {
  await sleep(1000); // Simulate a delay for the action
  console.log('Adding pet:', petData);
  // await prisma?.pet.create({
  //   data: pet,
  // });

  try {
    await prisma?.pet.create({
      // data: {
      //   name: formData.get('name'),
      //   ownerName: formData.get('ownerName'),
      //   age: parseInt(formData.get('age')),
      //   imageUrl:
      //     formData.get('imageUrl') ||
      //     'https://cdn-icons-png.flaticon.com/512/235/235405.png',
      //   notes: formData.get('notes'),
      // },
      data: petData,
    });
  } catch (error) {
    return {
      message: 'Failed to add pet. Please try again later.',
    };
  }

  revalidatePath('/app/', 'layout'); // Revalidate the path to update the data
}

export async function editPet(petId: Pet['id'], newPetData: PetEssentials) {
  await sleep(2000);

  try {
    await prisma?.pet.update({
      where: { id: petId },
      // data: {
      //   name: formData.get('name'),
      //   ownerName: formData.get('ownerName'),
      //   age: parseInt(formData.get('age')),
      //   imageUrl: formData.get('imageUrl'),
      //   notes: formData.get('notes'),
      // },
      data: newPetData,
    });
  } catch (error) {
    return {
      message: 'Failed to edit pet. Please try again later.',
    };
  }

  revalidatePath('/app/', 'layout');
}

export async function deletePet(petId: Pet['id']) {
  await sleep(2000);

  try {
    await prisma?.pet.delete({
      where: { id: petId },
    });
  } catch (error) {
    return {
      message: 'Failed to delete pet. Please try again later.',
    };
  }

  revalidatePath('/app/', 'layout');
}
