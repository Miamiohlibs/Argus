import { getMmsIdByCallNumber } from '@/app/actions/primoSearch';
import { lookupAny } from '@/app/actions/almaSearch';
import { NextResponse } from 'next/server';

export async function GET() {
  const response = await lookupAny('Green eggs and ham');
  return NextResponse.json(response);
}
