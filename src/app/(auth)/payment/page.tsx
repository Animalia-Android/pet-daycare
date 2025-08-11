'use client';

import { createCheckoutSession } from '@/actions/actions';
import H1 from '@/components/h1';
import { Button } from '@/components/ui/button';
import React, { useTransition } from 'react';

export default function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const [isPending, startTransistion] = useTransition();

  return (
    <main className="flex flex-col items-center space-y-10">
      {!searchParams.success && (
        <>
          <H1>PetSoft access requires payment</H1>
          <Button
            disabled={isPending}
            onClick={async () => {
              startTransistion(async () => {
                await createCheckoutSession();
              });
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

      {searchParams.cancelled && (
        <p className="text-lg text-red-700">
          Payment cancelled. Please try again.
        </p>
      )}
    </main>
  );
}
