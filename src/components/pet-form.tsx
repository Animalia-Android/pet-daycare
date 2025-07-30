'use client';

import { usePetContext } from '@/lib/hooks';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import PetFormBtn from './pet-form-btn';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

type PetFormProps = {
  actionType: 'add' | 'edit';
  onFormSubmission: () => void;
};

type TPetForm = {
  name: string;
  ownerName: string;
  imageUrl?: string;
  age: unknown;
  notes: string;
};

const petFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: 'Name is required' })
    .max(50, { message: 'Name must be less than 50 characters' }),
  ownerName: z
    .string()
    .trim()
    .min(2, { message: 'Owner name is required' })
    .max(50, { message: 'Owner name must be less than 50 characters' }),
  imageUrl: z
    .string()
    .trim()
    .optional()
    .refine(
      (val) => {
        if (!val) return true;
        try {
          const url = new URL(val);
          return ['http:', 'https:'].includes(url.protocol);
        } catch {
          return false;
        }
      },
      { message: 'Image URL must be a valid http or https URL' }
    ),
  age: z.coerce
    .number()
    .int()
    .positive()
    .min(0, { message: 'Age must be a positive integer' })
    .max(100, { message: 'Age must be a positive integer less than 100' }),
  notes: z.union([
    z
      .string()
      .trim()
      .max(1000, { message: 'Notes must be less than 500 characters' }),
  ]),
});

export default function PetForm({
  actionType,
  onFormSubmission,
}: PetFormProps) {
  const { selectedPet, handleAddPet, handleEditPet } = usePetContext();
  const {
    register,
    trigger,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<TPetForm>({
    resolver: zodResolver(petFormSchema),
  });

  return (
    <form
      className="flex flex-col"
      action={async (formData) => {
        const result = await trigger();
        if (!result) {
          return;
        }
        onFormSubmission();

        const petData = {
          name: formData.get('name') as string,
          ownerName: formData.get('ownerName') as string,
          imageUrl:
            (formData.get('imageUrl') as string) ||
            'https://cdn-icons-png.flaticon.com/512/235/235405.png',
          age: Number(formData.get('age')) as number,
          notes: formData.get('notes') as string,
        };

        if (actionType === 'add') {
          await handleAddPet(petData);
        } else if (actionType === 'edit' && selectedPet) {
          await handleEditPet(selectedPet!.id, petData);
        }
      }}
      // action={formAction}
    >
      {/* {error && <p className="text-red-500">{error.message}</p>} */}
      <div className="space-y-3">
        <div className="space-y-1">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            {...register('name', {
              required: 'Name is required',
              minLength: {
                value: 3,
                message: 'Name must be at least 2 characters long',
              },
            })}
            // type="text"
            // name="name"
            // required
            // defaultValue={actionType === 'edit' ? selectedPet?.name : ''}
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="ownerName">Owner Name</Label>
          <Input
            id="ownerName"
            {...register('ownerName', {
              required: 'Owner name is required',
              minLength: {
                value: 3,
                message: 'Owner name must be at least 2 characters long',
              },
            })}
            // type="text"
            // name="ownerName"
            // required
            // defaultValue={actionType === 'edit' ? selectedPet?.ownerName : ''}
          />
          {errors.ownerName && (
            <p className="text-red-500 text-sm">{errors.ownerName.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="imageUrl">Image Url</Label>
          <Input
            id="imageUrl"
            {...register('imageUrl')}
            // type="text"
            // name="imageUrl"
            // defaultValue={actionType === 'edit' ? selectedPet?.imageUrl : ''}
          />
          {errors.imageUrl && (
            <p className="text-red-500 text-sm">{errors.imageUrl.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="age">Age</Label>
          <Input
            id="age"
            {...register('age')}
            // type="number"
            // name="age"
            // required
            // defaultValue={actionType === 'edit' ? selectedPet?.age : ''}
          />
          {errors.age && (
            <p className="text-red-500 text-sm">{errors.age.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            {...register('notes')}
            // rows={3}
            // placeholder="Enter notes about the pet"
            // name="notes"
            // required
            // defaultValue={actionType === 'edit' ? selectedPet?.notes : ''}
          />
          {errors.notes && (
            <p className="text-red-500 text-sm">{errors.notes.message}</p>
          )}
        </div>
      </div>

      <PetFormBtn actionType={actionType} />
    </form>
  );
}
