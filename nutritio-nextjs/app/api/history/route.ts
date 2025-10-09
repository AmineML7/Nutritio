import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Récupérer l'historique de l'utilisateur
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const history = await prisma.dailyHistory.findMany({
      where: { userId: session.user.id },
      orderBy: { date: 'desc' }
    });

    const formattedHistory = history.map(entry => ({
      date: entry.date,
      aliments: JSON.parse(entry.aliments),
      totalCalories: entry.totalCalories
    }));

    return NextResponse.json(formattedHistory);
  } catch (error) {
    console.error('Erreur GET history:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// POST - Sauvegarder l'historique quotidien
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const { date, aliments, totalCalories } = await request.json();

    // Upsert : mettre à jour si existe, créer sinon
    const entry = await prisma.dailyHistory.upsert({
      where: {
        userId_date: {
          userId: session.user.id,
          date
        }
      },
      update: {
        aliments: JSON.stringify(aliments),
        totalCalories
      },
      create: {
        userId: session.user.id,
        date,
        aliments: JSON.stringify(aliments),
        totalCalories
      }
    });

    return NextResponse.json({ success: true, entry });
  } catch (error) {
    console.error('Erreur POST history:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// DELETE - Supprimer une entrée d'historique
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');

    if (!date) {
      return NextResponse.json({ error: 'Date requise' }, { status: 400 });
    }

    await prisma.dailyHistory.delete({
      where: {
        userId_date: {
          userId: session.user.id,
          date
        }
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur DELETE history:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}


