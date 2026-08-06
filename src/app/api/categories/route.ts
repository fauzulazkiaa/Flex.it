import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { DEFAULT_CATEGORIES } from '@/types';

export async function GET() {
  try {
    let categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
    });

    // Auto-seed if empty
    if (categories.length === 0) {
      await prisma.category.createMany({
        data: DEFAULT_CATEGORIES.map(c => ({
          id: c.id,
          name: c.name,
          color: c.color,
          iconName: c.iconName,
          description: c.description || '',
        })),
      });

      categories = await prisma.category.findMany({
        orderBy: { name: 'asc' },
      });
    }

    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, color, iconName, description } = body;

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const category = await prisma.category.create({
      data: {
        name,
        color: color || 'blue',
        iconName: iconName || 'Folder',
        description,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
