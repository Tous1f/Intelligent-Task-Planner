import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { User } from '@prisma/client';

export class BaseService {
  protected async getCurrentUser(): Promise<User | null> {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return null;
    }

    return prisma.user.findUnique({
      where: { email: session.user.email },
    });
  }

  protected handleError(error: unknown): never {
    console.error('Service error:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unexpected error occurred');
  }
}
