// import { Prisma } from '@prisma/client';
import prisma from '@/lib/db';

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export async function POST(request: Request) {
  console.log('Getting Data....');

  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  //verify webhook came from stripe
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.log('Webhook verification failed', 'Error: ', error);
    return Response.json(null, { status: 400 });
  }

  //fulfill order
  switch (event.type) {
    case 'checkout.session.completed':
      await prisma?.user.update({
        where: {
          email: event.data.object.customer_email,
        },
        data: {
          hasAccess: true,
        },
      });
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
      break;
  }

  console.log('Updated Data:', body);

  //return response 200 ok
  return Response.json(null, { status: 200 });
}
