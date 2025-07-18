'use client';

import { usePetContext } from '@/lib/hooks';
import { cn } from '@/lib/utils';
import Image from 'next/image';

export default function PetList() {
  const { pets, selectedPetId, handleChangeSelectedPetId } = usePetContext();

  return (
    <ul className="bg-white border-b border-black/[0.08]">
      {pets.map((pet) => (
        <li key={pet.id}>
          <button
            className={cn(
              'flex items-center h-[70px] w-full cursor-pointer px-5 text-base gap-3 hover:bg-[#EFF1F2] focus:bg-[#EFF1F2] transition',
              { 'bg-[#EFF1F2]': selectedPetId === pet.id }
            )}
            onClick={() => {
              // Handle pet selection logic here
              handleChangeSelectedPetId(pet.id);
            }}
          >
            <Image
              className="rounded-full object-cover w-[45px] h-[45px]"
              src={pet.imageUrl}
              alt={`${pet.name} Image`}
              width={45}
              height={45}
            />
            <p className="font-semibold">{pet.name}</p>
          </button>
        </li>
      ))}
    </ul>
  );
}
