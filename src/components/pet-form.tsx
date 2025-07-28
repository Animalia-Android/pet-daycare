'use client';

import { usePetContext } from '@/lib/hooks';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { addPet, editPet } from '@/actions/actions';
import PetFormBtn from './pet-form-btn';
import { toast } from 'sonner';
import { useFormState } from 'react-dom';

type PetFormProps = {
  actionType: 'add' | 'edit';
  onFormSubmission: () => void;
};

export default function PetForm({
  actionType,
  onFormSubmission,
}: PetFormProps) {
  const { selectedPet } = usePetContext();
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
        if (actionType === 'add') {
          const error = await addPet(formData);

          if (error) {
            toast.warning(error.message);
            return;
          }
        } else if (actionType === 'edit' && selectedPet) {
          const error = await editPet(selectedPet.id, formData);

          if (error) {
            toast.warning(error.message);
            return;
          }
        }

        onFormSubmission();
      }}
      // action={formAction}
    >
      {/* {error && <p className="text-red-500">{error.message}</p>} */}
      <div className="space-y-3">
        <div className="space-y-1">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            type="text"
            required
            defaultValue={actionType === 'edit' ? selectedPet?.name : ''}
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="ownerName">Owner Name</Label>
          <Input
            id="ownerName"
            name="ownerName"
            type="text"
            required
            defaultValue={actionType === 'edit' ? selectedPet?.ownerName : ''}
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="imageUrl">Image Url</Label>
          <Input
            id="imageUrl"
            name="imageUrl"
            type="text"
            defaultValue={actionType === 'edit' ? selectedPet?.imageUrl : ''}
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="age">Age</Label>
          <Input
            id="age"
            name="age"
            type="number"
            required
            defaultValue={actionType === 'edit' ? selectedPet?.age : ''}
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            name="notes"
            rows={3}
            placeholder="Enter notes about the pet"
            required
            defaultValue={actionType === 'edit' ? selectedPet?.notes : ''}
          />
        </div>
      </div>

      <PetFormBtn actionType={actionType} />
    </form>
  );
}
