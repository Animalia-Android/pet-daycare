'use server';

import { signIn, signOut } from '@/lib/auth';
import { sleep } from '@/lib/utils';
import { petFormSchema, petIdSchema } from '@/lib/validations';
import { revalidatePath } from 'next/cache';

//------ user actions ------

export async function logIn(formData: FormData) {
  // const data = {
  //   email: authData.get('email'),
  //   password: authData.get('password,'),
  // };

  const authData = Object.fromEntries(formData.entries());

  console.log('Logging in with authData:', authData);

  await signIn('credentials', authData);
}

export async function logOut() {
  await signOut({ redirectTo: '/' });
}

//------ pet actions ------

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
  await sleep(1000);

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
