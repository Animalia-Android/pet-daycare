import AppFooter from '@/components/app-footer';
import AppHeader from '@/components/app-header';
import BackgroundPattern from '@/components/background-pattern';
import { Toaster } from '@/components/ui/sonner';
import PetContextProvider from '@/contexts/pet-context-provider';
import SearchContextProvider from '@/contexts/search-context-provider';
import prisma from '@/lib/db';
import { checkAuth, getPetsByUserId } from '@/lib/server-utils';

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fetching data from an Bytegrad API endpoint
  // const response = await fetch(
  //   'https://bytegrad.com/course-assets/projects/petsoft/api/pets'
  // );
  // if (!response.ok) {
  //   throw new Error('Failed to fetch pets');
  // }
  // const data: Pet[] = await response.json();
  const session = await checkAuth();
  const pets = await getPetsByUserId(session.user.id);

  return (
    <>
      <BackgroundPattern />

      <div className="flex flex-col max-w-[1050px] min-h-screen mx-auto px-4">
        <AppHeader />
        <SearchContextProvider>
          <PetContextProvider data={pets}>{children}</PetContextProvider>
        </SearchContextProvider>
        <AppFooter />
      </div>

      <Toaster position="top-right" />
    </>
  );
}
