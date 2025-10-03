import { NextRequest, NextResponse } from 'next/server';
import { getAliment } from '@/lib/data';

export async function GET(
  request: NextRequest,
  { params }: { params: { code: string } }
) {
  const code = parseInt(params.code);
  const aliment = getAliment(code);

  if (!aliment) {
    return NextResponse.json({ error: 'Aliment non trouvé' }, { status: 404 });
  }

  return NextResponse.json(aliment);
}

