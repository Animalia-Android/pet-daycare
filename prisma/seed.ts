import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const pets = [
  {
    name: 'Mushu',
    ownerName: 'Doug Sellers',
    imageUrl: 'https://bytegrad.com/course-assets/images/rn-image-4.png',
    age: 2,
    notes: 'Loves to bark. Plays well with other dogs.',
  },
  {
    name: 'Oso',
    ownerName: 'Zai Sellers',
    imageUrl: 'https://bytegrad.com/course-assets/images/rn-image-5.png',
    age: 2,
    notes: 'Loves to play with other dogs. Loves to chase girls.',
  },
  {
    name: 'Bear',
    ownerName: 'Doug Sellers',
    imageUrl: 'https://bytegrad.com/course-assets/images/rn-image-6.png',
    age: 22,
    notes: 'Hungy for adventures',
  },
];

async function main() {
  console.log(`Start seeding ...`);

  for (const pet of pets) {
    const result = await prisma.pet.create({
      data: pet,
    });
    console.log(`Created pet with id: ${result.id}`);
  }

  console.log(`Seeding finished.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
