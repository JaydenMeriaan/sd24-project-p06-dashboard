// app/api/favorites/route.ts - SIMPELERE VERSIE
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const sdgNumber = searchParams.get('sdg');
    
    // Haal user ID uit cookies
    const cookieStore = cookies();
    const tokenCookie = cookieStore.get('token');
    
    if (!tokenCookie) {
      // Geen token = geen user
      return NextResponse.json(sdgNumber ? { isFavorite: false } : []);
    }
    
    const token = tokenCookie.value;
    const JWT_SECRET = process.env.JWT_SECRET || 'dev_jwt_secret_change_me';
    
    let userId: string | null = null;

    // Support JWT token or legacy base64(userId)
    if (token.includes('.')) {
      try {
        const payload = jwt.verify(token, JWT_SECRET) as { id?: string };
        userId = payload?.id || null;
      } catch (error) {
        console.log('Invalid JWT token:', error);
        // fallthrough to try base64 below
      }
    }

    if (!userId) {
      try {
        const decoded = Buffer.from(token, 'base64').toString('utf-8');
        if (decoded) userId = decoded;
      } catch (err) {
        // ignore
      }
    }

    if (!userId) {
      return NextResponse.json(sdgNumber ? { isFavorite: false } : []);
    }
    
    if (sdgNumber) {
      const favorite = await prisma.favorite.findFirst({
        where: { 
          userId, 
          sdgNumber: parseInt(sdgNumber) 
        }
      });
      
      return NextResponse.json({ isFavorite: !!favorite });
    } else {
      const favorites = await prisma.favorite.findMany({
        where: { userId },
        select: { sdgNumber: true }
      });
      
      const favoriteNumbers = favorites.map(fav => fav.sdgNumber);
      return NextResponse.json(favoriteNumbers);
    }
  } catch (error) {
    console.error('GET /api/favorites error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch favorites' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { sdgNumber } = await request.json();
    
    if (!sdgNumber || isNaN(Number(sdgNumber))) {
      return NextResponse.json(
        { error: 'Ongeldig SDG nummer' },
        { status: 400 }
      );
    }
    
    // Haal user ID uit cookies
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get('token');
    
    if (!tokenCookie) {
      return NextResponse.json(
        { error: 'Niet ingelogd' },
        { status: 401 }
      );
    }
    
    const token = tokenCookie.value;
    const JWT_SECRET = process.env.JWT_SECRET || 'dev_jwt_secret_change_me';
    
    let userId: string | null = null;

    if (token.includes('.')) {
      try {
        const payload = jwt.verify(token, JWT_SECRET) as { id?: string };
        userId = payload?.id || null;
      } catch (error) {
        console.log('Invalid JWT token:', error);
      }
    }

    if (!userId) {
      try {
        const decoded = Buffer.from(token, 'base64').toString('utf-8');
        if (decoded) userId = decoded;
      } catch (err) {
        // ignore
      }
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'Ongeldige sessie' },
        { status: 401 }
      );
    }
    
    const sdgNum = Number(sdgNumber);
    
    // Check of het al een favorite is
    const existing = await prisma.favorite.findFirst({
      where: { userId, sdgNumber: sdgNum }
    });
    
    if (existing) {
      return NextResponse.json(
        { error: 'Al in favorieten' },
        { status: 409 }
      );
    }
    
    // Voeg toe aan favorieten
    const favorite = await prisma.favorite.create({
      data: { userId, sdgNumber: sdgNum }
    });
    
    return NextResponse.json({ 
      success: true, 
      message: 'Toegevoegd aan favorieten',
      favorite 
    });
  } catch (error: any) {
    console.error('POST /api/favorites error:', error);
    
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Al in favorieten' },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { error: 'Server fout' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { sdgNumber } = await request.json();
    
    if (!sdgNumber || isNaN(Number(sdgNumber))) {
      return NextResponse.json(
        { error: 'Ongeldig SDG nummer' },
        { status: 400 }
      );
    }
    
    // Haal user ID uit cookies
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get('token');
    
    if (!tokenCookie) {
      return NextResponse.json(
        { error: 'Niet ingelogd' },
        { status: 401 }
      );
    }
    
    const token = tokenCookie.value;
    const JWT_SECRET = process.env.JWT_SECRET || 'dev_jwt_secret_change_me';
    
    let userId: string | null = null;

    if (token.includes('.')) {
      try {
        const payload = jwt.verify(token, JWT_SECRET) as { id?: string };
        userId = payload?.id || null;
      } catch (error) {
        console.log('Invalid JWT token:', error);
      }
    }

    if (!userId) {
      try {
        const decoded = Buffer.from(token, 'base64').toString('utf-8');
        if (decoded) userId = decoded;
      } catch (err) {
        // ignore
      }
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'Ongeldige sessie' },
        { status: 401 }
      );
    }
    
    const sdgNum = Number(sdgNumber);
    
    // Verwijder uit favorieten
    const result = await prisma.favorite.deleteMany({
      where: { userId, sdgNumber: sdgNum }
    });
    
    if (result.count === 0) {
      return NextResponse.json(
        { error: 'Niet gevonden in favorieten' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Verwijderd uit favorieten' 
    });
  } catch (error) {
    console.error('DELETE /api/favorites error:', error);
    return NextResponse.json(
      { error: 'Server fout' },
      { status: 500 }
    );
  }
}