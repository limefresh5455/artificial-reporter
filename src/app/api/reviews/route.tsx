// app/api/reviews/route.ts
import { NextResponse } from 'next/server';
import { client } from '@/lib/client'; // You must configure this

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, details, stars, productId } = body;

    if (!details || !stars || !productId) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    const result = await client.create({
      _type: 'productReview',
      name: name || '',
      email: email || '',
      details,
      stars: parseInt(stars),
      product: {
        _type: 'reference',
        _ref: productId,
      },
      date_of_review: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, reviewId: result._id });
  } catch (err) {
    console.error('Review submission failed:', err);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
