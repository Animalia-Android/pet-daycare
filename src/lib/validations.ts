import z from 'zod';
import { DEAULT_PET_IMAGE_URL } from './constants';

export const petIdSchema = z.string().cuid();

export const petFormSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, { message: 'Name is required and must be atleast 2 characters' })
      .max(50, { message: 'Name must be less than 50 characters' }),
    ownerName: z
      .string()
      .trim()
      .min(2, {
        message: 'Owner name is required and must be atleast 2 characters',
      })
      .max(50, { message: 'Owner name must be less than 50 characters' }),
    imageUrl: z.union([
      z.literal(''),
      z.string().trim().url({
        message: 'Image URL must be a valid URL',
      }),
    ]),
    age: z.coerce
      .number({ message: 'Must be a postive number' })
      .int({ message: 'Must be a postive number' })
      .positive({ message: 'Must be a postive number' })
      .max(99999),
    notes: z.union([z.literal(''), z.string().trim().max(1000)]),
  })
  .transform((data) => ({
    ...data,
    imageUrl: data.imageUrl || DEAULT_PET_IMAGE_URL,
    age: Number(data.age),
  }));

export type TPetForm = z.infer<typeof petFormSchema>;
