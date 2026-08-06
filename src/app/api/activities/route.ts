import { NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

async function getOrCreateUser(userId: string) {
  let user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    const clerkUser = await currentUser();
    if (clerkUser) {
      const email = clerkUser.emailAddresses[0]?.emailAddress;
      const name = `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || 'User';
      user = await prisma.user.create({
        data: {
          id: userId,
          email,
          name,
          imageUrl: clerkUser.imageUrl,
        },
      });
    }
  }
  return user;
}

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await getOrCreateUser(userId);

    const activities = await prisma.activity.findMany({
      where: { userId },
      include: { category: true },
      orderBy: { regDeadline: 'asc' },
    });

    // Format Date to string representation for UI
    const formattedActivities = activities.map(act => ({
      ...act,
      regDeadline: act.regDeadline.toISOString().split('T')[0],
      submitDeadline: act.submitDeadline?.toISOString().split('T')[0],
      announcementDate: act.announcementDate?.toISOString().split('T')[0],
      eventDate: act.eventDate?.toISOString().split('T')[0],
    }));

    return NextResponse.json(formattedActivities);
  } catch (error) {
    console.error('Error fetching activities:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await getOrCreateUser(userId);

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

    if (!title || !categoryId || !regDeadline) {
      return NextResponse.json({ error: 'Title, categoryId, and regDeadline are required' }, { status: 400 });
    }

    const activity = await prisma.activity.create({
      data: {
        title,
        categoryId,
        userId,
        status: status || 'BELUM_DAFTAR',
        regDeadline: new Date(regDeadline),
        submitDeadline: submitDeadline ? new Date(submitDeadline) : null,
        announcementDate: announcementDate ? new Date(announcementDate) : null,
        eventDate: eventDate ? new Date(eventDate) : null,
        organizer,
        details: details || '',
        infoUrl,
        driveUrl,
        submissionUrl,
        documentsUrl,
        year: year ? parseInt(year) : new Date().getFullYear(),
        tags: tags || [],
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
    console.error('Error creating activity:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
