import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

// Helper to check if the current user is the owner or a team member
async function verifyAccess(activityId: string, userId: string) {
  const activity = await prisma.activity.findUnique({
    where: { id: activityId },
    include: { teamMembers: true },
  });

  if (!activity) return { activity: null, hasAccess: false, isOwner: false };

  const isOwner = activity.userId === userId;
  const isMember = activity.teamMembers.some((m) => m.userId === userId && m.status === 'ACCEPTED');

  return { activity, hasAccess: isOwner || isMember, isOwner };
}

export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: activityId } = await context.params;
    
    const { hasAccess } = await verifyAccess(activityId, userId);
    if (!hasAccess) {
      return NextResponse.json({ error: 'Not Found or Unauthorized' }, { status: 404 });
    }

    const members = await prisma.teamMember.findMany({
      where: { activityId },
      include: {
        user: {
          select: { name: true, imageUrl: true }
        }
      },
      orderBy: { createdAt: 'asc' }
    });

    return NextResponse.json(members);
  } catch (error) {
    console.error('Error fetching team members:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: activityId } = await context.params;
    
    const { hasAccess, isOwner } = await verifyAccess(activityId, userId);
    
    if (!hasAccess) {
      return NextResponse.json({ error: 'Not Found or Unauthorized' }, { status: 404 });
    }

    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Check if the invited email is already the owner
    const ownerUser = await prisma.user.findUnique({ where: { id: userId }});
    if (ownerUser?.email === email) {
      return NextResponse.json({ error: 'Cannot invite yourself' }, { status: 400 });
    }

    // See if user exists in DB to prepopulate userId
    const existingUser = await prisma.user.findUnique({ where: { email } });

    const newMember = await prisma.teamMember.create({
      data: {
        activityId,
        email,
        userId: existingUser?.id || null,
        status: 'PENDING',
      },
      include: {
        user: { select: { name: true, imageUrl: true } }
      }
    });

    return NextResponse.json(newMember);
  } catch (error: any) {
    console.error('Error inviting team member:', error);
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'User is already invited' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: activityId } = await context.params;
    const { hasAccess } = await verifyAccess(activityId, userId);
    
    if (!hasAccess) {
      return NextResponse.json({ error: 'Not Found or Unauthorized' }, { status: 404 });
    }

    const url = new URL(req.url);
    const memberId = url.searchParams.get('memberId');
    if (!memberId) {
      return NextResponse.json({ error: 'memberId is required' }, { status: 400 });
    }

    const member = await prisma.teamMember.findUnique({ where: { id: memberId }});
    if (!member) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }

    // Only owner can remove anyone, member can only remove themselves
    const activity = await prisma.activity.findUnique({ where: { id: activityId }});
    const isOwner = activity?.userId === userId;
    
    if (!isOwner && member.userId !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await prisma.teamMember.delete({
      where: { id: memberId }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error removing team member:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
