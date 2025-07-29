'use client';

import { usePetContext } from '@/lib/hooks';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import PetFormBtn from './pet-form-btn';
import { useForm } from 'react-hook-form';

type PetFormProps = {
  actionType: 'add' | 'edit';
  onFormSubmission: () => void;
};

type TPetForm = {
  name: string;
  ownerName: string;
  imageUrl?: string;
  age: number;
  notes: string;
};

export default function PetForm({
  actionType,
  onFormSubmission,
}: PetFormProps) {
  const { selectedPet, handleAddPet, handleEditPet } = usePetContext();
  const {
    register,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<TPetForm>();
  // const [error, formAction] = useFormState(addPet, {});

  // Handle form submission
  // const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
  //   event.preventDefault();
  //   // Handle form submission logic here
  //   const formData = new FormData(event.currentTarget);
  //   // const newPet = Object.fromEntries(formData.entries());
  //   const pet = {
  //     name: formData.get('name') as string,
  //     ownerName: formData.get('ownerName') as string,
  //     imageUrl:
  //       (formData.get('imageUrl') as string) ||
  //       'https://bytegrad.com/course-assets/react-nextjs/pet-placeholder.png',
  //     age: Number(formData.get('age')) as number,
  //     notes: formData.get('notes') as string,
  //   };

  //   if (actionType === 'add') {
  //     handleAddPet(pet);
  //   } else if (actionType === 'edit' && selectedPet) {
  //     handleEditPet(selectedPet!.id, pet);
  //   }

  //   onFormSubmission();
  // };

  return (
    <form
      className="flex flex-col"
      action={async (formData) => {
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
            {...register('name')}
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
            {...register('ownerName')}
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
