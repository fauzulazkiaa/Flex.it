import { NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const clerkUser = await currentUser();
    const email = clerkUser?.emailAddresses[0]?.emailAddress;

    if (!email) {
      return NextResponse.json({ error: 'No email found' }, { status: 400 });
    }

    // Link user to pending invitations if they just signed up
    await prisma.teamMember.updateMany({
      where: { email, userId: null },
      data: { userId }
    });

    const invitations = await prisma.teamMember.findMany({
      where: { email, status: 'PENDING' },
      include: {
        activity: {
          include: { category: true, user: { select: { name: true, email: true } } }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(invitations);
  } catch (error) {
    console.error('Error fetching invitations:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const clerkUser = await currentUser();
    const email = clerkUser?.emailAddresses[0]?.emailAddress;

    if (!email) {
      return NextResponse.json({ error: 'No email found' }, { status: 400 });
    }

    const { invitationId, action } = await req.json(); // action can be 'ACCEPT' or 'REJECT'
    if (!invitationId || !action) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    const invitation = await prisma.teamMember.findUnique({
      where: { id: invitationId }
    });

    if (!invitation || invitation.email !== email) {
      return NextResponse.json({ error: 'Not Found or Unauthorized' }, { status: 404 });
    }

    if (action === 'ACCEPT') {
      const updated = await prisma.teamMember.update({
        where: { id: invitationId },
        data: { status: 'ACCEPTED', userId } // Ensure userId is set
      });
      return NextResponse.json(updated);
    } else if (action === 'REJECT') {
      await prisma.teamMember.delete({
        where: { id: invitationId }
      });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Error processing invitation:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
