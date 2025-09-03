import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth/[...nextauth]/route';
import { SmartScheduler } from '@/lib/ai/planner/smart-scheduler';

const smartScheduler = new SmartScheduler();

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { preferredDate, timeSlots, priority } = await request.json();
    
    const scheduleResult = await smartScheduler.scheduleTask({
      taskId: params.id,
      preferredDate: preferredDate ? new Date(preferredDate) : undefined,
      timeSlots,
      priority
    });

    return NextResponse.json({ success: true, schedule: scheduleResult });

  } catch (error) {
    console.error('Schedule creation error:', error);
    return NextResponse.json({ error: 'Failed to schedule task' }, { status: 500 });
  }
}
