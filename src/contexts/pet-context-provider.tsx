'use client';

import { addPet } from '@/actions/actions';
import { Pet } from '@/lib/types';
import React, { createContext, useState } from 'react';

type PetContextProviderProps = {
  data: Pet[];
  children: React.ReactNode;
};

type TPetContext = {
  pets: Pet[];
  selectedPetId: string | null;
  selectedPet: Pet | undefined;
  numberOfPets: number;
  handleAddPet: (newPet: Omit<Pet, 'id'>) => void;
  handleEditPet: (petId: string, newPetData: Omit<Pet, 'id'>) => void;
  handleChangeSelectedPetId: (id: string) => void;
  handleCheckoutPet: (id: string) => void;
  // You can add more properties or methods as needed
};

export const PetContext = createContext<TPetContext | null>(null);

export default function PetContextProvider({
  data,
  children,
}: PetContextProviderProps) {
  //state
  const [pets, setPets] = useState(data);
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);

  //derived state or methods
  const selectedPet = pets.find((pet) => pet.id === selectedPetId);
  const numberOfPets = pets.length;

  //event handlers
  const handleAddPet = async (newPet: Omit<Pet, 'id'>) => {
    // setPets((prevPets) => [
    //   ...prevPets,
    //   { ...newPet, id: crypto.randomUUID() },
    // ]);
    // fetch("https://petsoft.com/api/pets", {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({ ...newPet, id: crypto.randomUUID() }),
    // })
    // .then(response => response.json())
    // .then(data => {
    //   console.log('Pet added successfully:', data);
    // }
    // )
    // .catch((error) => {
    //   console.error('Error adding pet:', error);
    // }
    // );
    // setSelectedPetId(null); // Reset selected pet after adding
    await addPet(newPet);
  };

  const handleEditPet = (petId: string, newPetData: Omit<Pet, 'id'>) => {
    setPets((prevPets) =>
      prevPets.map((pet) =>
        pet.id === petId ? { ...pet, ...newPetData } : pet
      )
    );
    // setSelectedPetId(null); // Reset selected pet after editing
  };

  const handleCheckoutPet = (id: string) => {
    setPets((prevPets) => prevPets.filter((pet) => pet.id !== id));
    setSelectedPetId(null);
  };

  const handleChangeSelectedPetId = (id: string | null) => {
    setSelectedPetId(id);
  };
  return (
    <PetContext.Provider
      value={{
        pets,
        selectedPetId,
        selectedPet,
        numberOfPets,
        handleAddPet,
        handleEditPet,
        handleCheckoutPet,
        handleChangeSelectedPetId,
      }}
    >
      {children}
    </PetContext.Provider>
  );
}
