import { getMmsIdByCallNumber } from '@/app/actions/primoSearch';
import { NextResponse } from 'next/server';

export async function GET() {
  const response = await getMmsIdByCallNumber({
    callNumber: 'PR6029.R8 Z7532 1984',
  });
  return NextResponse.json(response);
}
