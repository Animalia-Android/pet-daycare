'use client';

import { usePetContext } from '@/lib/hooks';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import PetFormBtn from './pet-form-btn';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DEAULT_PET_IMAGE_URL } from '@/lib/constants';
import { petFormSchema, TPetForm } from '@/lib/validations';

type PetFormProps = {
  actionType: 'add' | 'edit';
  onFormSubmission: () => void;
};

export default function PetForm({
  actionType,
  onFormSubmission,
}: PetFormProps) {
  const { selectedPet, handleAddPet, handleEditPet } = usePetContext();
  const {
    register,
    trigger,
    getValues,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<TPetForm>({
    resolver: zodResolver(petFormSchema),
    defaultValues:
      actionType === 'edit'
        ? {
            name: selectedPet?.name,
            ownerName: selectedPet?.ownerName,
            imageUrl: selectedPet?.imageUrl,
            age: selectedPet?.age as number,
            notes: selectedPet?.notes,
          }
        : undefined,
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

        const petData = getValues();
        petData.imageUrl = petData.imageUrl || DEAULT_PET_IMAGE_URL;

        if (actionType === 'add') {
          await handleAddPet(petData);
        } else if (actionType === 'edit' && selectedPet) {
          await handleEditPet(selectedPet!.id, petData);
        }
      }}
    >
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
          />
          {errors.ownerName && (
            <p className="text-red-500 text-sm">{errors.ownerName.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="imageUrl">Image Url</Label>
          <Input id="imageUrl" {...register('imageUrl')} />
          {errors.imageUrl && (
            <p className="text-red-500 text-sm">{errors.imageUrl.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="age">Age</Label>
          <Input
            id="age"
            {...register('age', {
              required: 'Age is required',
              minLength: {
                value: 1,
                message: 'Age is required and must be a positive number',
              },
            })}
          />
          {errors.age && (
            <p className="text-red-500 text-sm">{errors.age.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="notes">Notes</Label>
          <Textarea id="notes" {...register('notes')} />
          {errors.notes && (
            <p className="text-red-500 text-sm">{errors.notes.message}</p>
          )}
        </div>
      </div>

      <PetFormBtn actionType={actionType} />
    </form>
  );
}
