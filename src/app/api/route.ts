import { NextRequest, NextResponse } from 'next/server';
import { Scraper } from '@/utils/Scraper';

export async function GET({ nextUrl }: NextRequest): Promise<NextResponse> {
  const bidId = nextUrl.searchParams.get('bidId')?.trim();

  if (!bidId) {
    return new NextResponse('Invalid bid ID', { status: 400 });
  }

  const scraper = new Scraper();

  await scraper.init();

  try {
    const bid = await scraper.parseBid(bidId);

    await scraper.close();

    if (!bid) {
      return new NextResponse('Bid not found', { status: 404 });
    }

    return NextResponse.json(bid);
  } catch (error) {
    console.error(error);
    await scraper.close();

    return new NextResponse('Internal error', { status: 500 });
  }
}
