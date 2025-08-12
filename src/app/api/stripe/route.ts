// import { Prisma } from '@prisma/client';
import prisma from '@/lib/db';

export async function POST(request: Request) {
  console.log('Getting Data....');
  const data = await request.json();

  console.log('Data:', data);
  //verify webhook came from stripe

  //fulfill order
  await prisma?.user.update({
    where: {
      email: data.data.object.customer_email,
    },
    data: {
      hasAccess: true,
    },
  });

  console.log('Updated Data:', data);

  //return response 200 ok
  return Response.json(null, { status: 200 });
}
