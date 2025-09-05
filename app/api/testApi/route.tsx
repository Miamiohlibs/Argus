// import { getMmsIdByCallNumber } from '@/app/actions/primoSearch';
import { bibHoldingsByAny } from '@/app/actions/almaSearch';
import { NextResponse } from 'next/server';
import { CondensedBibHoldings } from '@/types/CondensedBibHoldings';

export async function GET() {
  const arr = [
    // '991000014819708518', //Flosculi
    'Z250.3 .F58 1967', // Flosculi
    'PS3552.R4825 E27 1990', // Earth
    // '991017357419708518', // Earth
    '991000024539708518', // Orwell
  ];
  const response: Array<{
    data?: CondensedBibHoldings;
    error?: string;
  }> = await Promise.all(
    arr.map(async (item) => {
      return await bibHoldingsByAny(item);
    })
  );
  return NextResponse.json(response);
}
