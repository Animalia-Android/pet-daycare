'use client';

import { createCheckoutSession } from '@/actions/actions';
import H1 from '@/components/h1';
import { Button } from '@/components/ui/button';
import React from 'react';

export default function Page({ searchParams }) {
  console.log('Search Params:', searchParams);
  return (
    <main className="flex flex-col items-center space-y-10">
      {!searchParams.success && (
        <>
          <H1>PetSoft access requires payment</H1>
          <Button
            onClick={async () => {
              await createCheckoutSession();
            }}
          >
            Buy lifetime access for $299{' '}
          </Button>
        </>
      )}

      {searchParams.success && (
        <p className="text-lg text-green-700">
          Payment successful! You now have lifetime access to PetSoft.
        </p>
      )}
    </main>
  );
}
