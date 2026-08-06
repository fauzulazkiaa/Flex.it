import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { getOrCreateUser } from '@/lib/user';

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await getOrCreateUser(userId);

    let activities = await prisma.activity.findMany({
      where: {
        OR: [
          { userId },
          { teamMembers: { some: { userId, status: 'ACCEPTED' } } }
        ]
      },
      include: { 
        category: true,
        teamMembers: {
          include: { user: { select: { name: true, imageUrl: true } } }
        }
      },
      orderBy: { regDeadline: 'asc' },
    });

    // Auto-seed dummy activities if empty
    if (activities.length === 0) {
      // Find default categories first
      const defaultCategories = await prisma.category.findMany({
        where: { userId }
      });

      if (defaultCategories.length > 0) {
        const { INITIAL_ACTIVITIES } = await import('@/data/initialData');
        
        await prisma.activity.createMany({
          data: INITIAL_ACTIVITIES.map(act => {
            // Find matching category ID in DB based on the initial data categoryId mapping
            // In initialData, categoryId looks like 'cat-youth-forum', 'cat-business-comp', etc.
            // The DB categories have actual UUIDs, so we must map them by name or description context
            
            // To simplify, we will just pick the first category available if we can't find exact match, 
            // but ideally we map them properly. Let's do a basic map based on name keywords.
            let matchedCatId = defaultCategories[0].id;
            
            if (act.categoryId === 'cat-youth-forum') matchedCatId = defaultCategories.find(c => c.name.includes('Youth'))?.id || matchedCatId;
            else if (act.categoryId === 'cat-business-comp') matchedCatId = defaultCategories.find(c => c.name.includes('Business'))?.id || matchedCatId;
            else if (act.categoryId === 'cat-hackathon') matchedCatId = defaultCategories.find(c => c.name.includes('Hackathon'))?.id || matchedCatId;
            else if (act.categoryId === 'cat-essay') matchedCatId = defaultCategories.find(c => c.name.includes('Essay'))?.id || matchedCatId;
            else if (act.categoryId === 'cat-video-editing') matchedCatId = defaultCategories.find(c => c.name.includes('Video'))?.id || matchedCatId;
            else if (act.categoryId === 'cat-pelatihan') matchedCatId = defaultCategories.find(c => c.name.includes('Pelatihan'))?.id || matchedCatId;
            else if (act.categoryId === 'cat-proyek-sosial') matchedCatId = defaultCategories.find(c => c.name.includes('Sosial'))?.id || matchedCatId;
            else if (act.categoryId === 'cat-infografis') matchedCatId = defaultCategories.find(c => c.name.includes('Infografis'))?.id || matchedCatId;

            return {
              title: act.title,
              categoryId: matchedCatId,
              userId,
              status: act.status,
              regDeadline: new Date(act.regDeadline),
              submitDeadline: act.submitDeadline ? new Date(act.submitDeadline) : null,
              announcementDate: act.announcementDate ? new Date(act.announcementDate) : null,
              eventDate: act.eventDate ? new Date(act.eventDate) : null,
              organizer: act.organizer,
              details: act.details || '',
              infoUrl: act.infoUrl,
              driveUrl: act.driveUrl,
              submissionUrl: act.submissionUrl,
              documentsUrl: act.documentsUrl,
              year: act.year,
              tags: act.tags || [],
              level: act.level,
              achievement: act.achievement,
              jenisPrestasi: act.jenisPrestasi,
            };
          }),
          skipDuplicates: true,
        });

        // Refetch activities
        activities = await prisma.activity.findMany({
          where: {
            OR: [
              { userId },
              { teamMembers: { some: { userId, status: 'ACCEPTED' } } }
            ]
          },
          include: { 
            category: true,
            teamMembers: {
              include: { user: { select: { name: true, imageUrl: true } } }
            }
          },
          orderBy: { regDeadline: 'asc' },
        });
      }
    }

    // Format Date to string representation for UI
    const formattedActivities = activities.map(act => ({
      ...act,
      regDeadline: act.regDeadline.toISOString().split('T')[0],
      submitDeadline: act.submitDeadline?.toISOString().split('T')[0],
      announcementDate: act.announcementDate?.toISOString().split('T')[0],
      eventDate: act.eventDate?.toISOString().split('T')[0],
    }));

    return NextResponse.json(formattedActivities);
  } catch (error: any) {
    console.error('Error fetching activities:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error?.message || String(error) }, { status: 500 });
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
