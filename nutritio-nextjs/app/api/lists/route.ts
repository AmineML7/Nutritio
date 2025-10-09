import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Récupérer les listes sauvegardées de l'utilisateur
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const lists = await prisma.foodList.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' }
    });

    const formattedLists = lists.map(list => ({
      id: list.id,
      name: list.name,
      aliments: JSON.parse(list.aliments),
      createdAt: list.createdAt.toISOString()
    }));

    return NextResponse.json(formattedLists);
  } catch (error) {
    console.error('Erreur GET lists:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// POST - Créer une nouvelle liste
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const { name, aliments } = await request.json();

    const list = await prisma.foodList.create({
      data: {
        userId: session.user.id,
        name,
        aliments: JSON.stringify(aliments)
      }
    });

    return NextResponse.json({
      id: list.id,
      name: list.name,
      aliments: JSON.parse(list.aliments),
      createdAt: list.createdAt.toISOString()
    });
  } catch (error) {
    console.error('Erreur POST list:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// DELETE - Supprimer une liste
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID requis' }, { status: 400 });
    }

    // Vérifier que la liste appartient à l'utilisateur
    const list = await prisma.foodList.findUnique({
      where: { id }
    });

    if (!list || list.userId !== session.user.id) {
      return NextResponse.json({ error: 'Liste non trouvée' }, { status: 404 });
    }

    await prisma.foodList.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur DELETE list:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}


