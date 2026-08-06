import { prisma } from './prisma';
import { currentUser } from '@clerk/nextjs/server';

export async function getOrCreateUser(userId: string) {
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
