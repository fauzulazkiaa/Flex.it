import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    const { id } = await params;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify ownership
    const existing = await prisma.activity.findUnique({
      where: { id },
    });

    if (!existing || existing.userId !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const {
      title,
      categoryId,
      status,
      regDeadline,
      submitDeadline,
      announcementDate,
      eventDate,
      organizer,
      details,
      infoUrl,
      driveUrl,
      submissionUrl,
      documentsUrl,
      year,
      tags,
      level,
      achievement,
      jenisPrestasi,
    } = body;

    const activity = await prisma.activity.update({
      where: { id },
      data: {
        title,
        categoryId,
        status,
        regDeadline: regDeadline ? new Date(regDeadline) : undefined,
        submitDeadline: submitDeadline !== undefined ? (submitDeadline ? new Date(submitDeadline) : null) : undefined,
        announcementDate: announcementDate !== undefined ? (announcementDate ? new Date(announcementDate) : null) : undefined,
        eventDate: eventDate !== undefined ? (eventDate ? new Date(eventDate) : null) : undefined,
        organizer,
        details,
        infoUrl,
        driveUrl,
        submissionUrl,
        documentsUrl,
        year: year ? parseInt(year) : undefined,
        tags,
        level,
        achievement,
        jenisPrestasi,
      },
    });

    const formattedActivity = {
      ...activity,
      regDeadline: activity.regDeadline.toISOString().split('T')[0],
      submitDeadline: activity.submitDeadline?.toISOString().split('T')[0],
      announcementDate: activity.announcementDate?.toISOString().split('T')[0],
      eventDate: activity.eventDate?.toISOString().split('T')[0],
    };

    return NextResponse.json(formattedActivity);
  } catch (error) {
    console.error('Error updating activity:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    const { id } = await params;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify ownership
    const existing = await prisma.activity.findUnique({
      where: { id },
    });

    if (!existing || existing.userId !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await prisma.activity.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting activity:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
