// import { getMmsIdByCallNumber } from '@/app/actions/primoSearch';
import { bibHoldingsByAny } from '@/app/actions/almaSearch';
import { NextResponse } from 'next/server';

export async function GET() {
  const response = await bibHoldingsByAny('Green eggs and ham');
  return NextResponse.json(response);
}
