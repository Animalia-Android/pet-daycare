'use server';

import { PetEssentials } from '@/lib/types';
import { sleep } from '@/lib/utils';
import { petFormSchema, petIdSchema } from '@/lib/validations';
import { Pet } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export async function addPet(pet: unknown) {
  await sleep(1000);

  const validatedPet = petFormSchema.safeParse(pet);
  if (!validatedPet.success) {
    return {
      message: 'Invalid pet data. Please check your input.',
    };
  }

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
      data: validatedPet.data,
    });
  } catch (error) {
    return {
      message: 'Failed to add pet. Please try again later.',
    };
  }

  revalidatePath('/app/', 'layout'); // Revalidate the path to update the data
}

export async function editPet(petId: unknown, newPetData: unknown) {
  await sleep(1000);

  const validatedPetId = petIdSchema.safeParse(petId);
  const validatedPet = petFormSchema.safeParse(newPetData);

  if (!validatedPet.success || !validatedPetId.success) {
    return {
      message: 'Invalid pet data. Please check your input.',
    };
  }

  try {
    await prisma?.pet.update({
      where: { id: validatedPetId.data },
      // data: {
      //   name: formData.get('name'),
      //   ownerName: formData.get('ownerName'),
      //   age: parseInt(formData.get('age')),
      //   imageUrl: formData.get('imageUrl'),
      //   notes: formData.get('notes'),
      // },
      data: validatedPet.data,
    });
  } catch (error) {
    return {
      message: 'Failed to edit pet. Please try again later.',
    };
  }

  revalidatePath('/app/', 'layout');
}

export async function deletePet(petId: unknown) {
  await sleep(2000);

  const validatedPetId = petIdSchema.safeParse(petId);

  if (!validatedPetId.success) {
    return {
      message: 'Invalid pet data. Please check your input.',
    };
  }

  try {
    await prisma?.pet.delete({
      where: { id: validatedPetId.data },
    });
  } catch (error) {
    return {
      message: 'Failed to delete pet. Please try again later.',
    };
  }

  revalidatePath('/app/', 'layout');
}
