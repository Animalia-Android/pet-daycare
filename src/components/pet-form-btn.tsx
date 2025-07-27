import { useFormStatus } from 'react-dom';
import { Button } from './ui/button';

export default function PetFormBtn({
  actionType,
}: {
  actionType: 'add' | 'edit';
}) {
  const { pending } = useFormStatus();
  return (
    <Button className="mt-5 self-end" type="submit" disabled={pending}>
      {actionType === 'add' ? 'Add Pet' : 'Update Pet'}
    </Button>
  );
}
