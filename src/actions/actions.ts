'use server';

import { auth, signIn, signOut } from '@/lib/auth';
import { checkAuth, getPetById } from '@/lib/server-utils';
import { sleep } from '@/lib/utils';
import { petFormSchema, petIdSchema } from '@/lib/validations';
import bcrypt from 'bcryptjs';
import { revalidatePath } from 'next/cache';

//------ user actions ------

//login
export async function logIn(formData: FormData) {
  // const data = {
  //   email: authData.get('email'),
  //   password: authData.get('password,'),
  // };

  const authData = Object.fromEntries(formData.entries());

  console.log('Logging in with authData:', authData);

  await signIn('credentials', authData);
}

//logout
export async function logOut() {
  await signOut({ redirectTo: '/' });
}

//signup
export async function signUp(formData: FormData) {
  const hashedPassword = bcrypt.hashSync(
    formData.get('password') as string,
    10
  );
  await prisma?.user.create({
    data: {
      email: formData.get('email') as string,
      hashedPassword: hashedPassword,
    },
  });

  await signIn('credentials', formData);
}

//------ pet actions ------

export async function addPet(pet: unknown) {
  await sleep(1000);

  const session = await checkAuth();

  const validatedPet = petFormSchema.safeParse(pet);
  if (!validatedPet.success) {
    return {
      message: 'Invalid pet data. Please check your input.',
    };
  }

  try {
    await prisma?.pet.create({
      data: {
        ...validatedPet.data,
        user: {
          connect: { id: session.user.id },
        },
      },
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

  //authentication check
  const session = await checkAuth();

  //validation
  const validatedPetId = petIdSchema.safeParse(petId);
  const validatedPet = petFormSchema.safeParse(newPetData);

  if (!validatedPet.success || !validatedPetId.success) {
    return {
      message: 'Invalid pet data. Please check your input.',
    };
  }

  //authorization check
  const pet = await getPetById(validatedPetId.data);

  if (!pet) {
    return {
      message: 'Pet not found.',
    };
  }

  if (pet.userId !== session.user.id) {
    return {
      message: 'Not authorized to edit pet.',
    };
  }

  //database mutation
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

  //authentication check
  const session = await checkAuth();

  //validation
  const validatedPetId = petIdSchema.safeParse(petId);

  if (!validatedPetId.success) {
    return {
      message: 'Invalid pet data. Please check your input.',
    };
  }

  //authorization check ( user owns pets )
  const pet = await getPetById(validatedPetId.data);

  if (!pet) {
    return {
      message: 'Pet not found.',
    };
  }

  if (pet.userId !== session.user.id) {
    return {
      message: 'Not authorized to delete pet.',
    };
  }

  //database mutation
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
