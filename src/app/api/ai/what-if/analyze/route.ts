import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth/[...nextauth]/auth';
import { prisma } from '@/lib/prisma';
import { WhatIfAnalyzer } from '@/lib/ai/planner/what-if-analyzer';
import { WhatIfParamsSchema } from '@/lib/ai/planner/what-if-types';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    
    // Validate request body
    const validationResult = WhatIfParamsSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid request parameters', details: validationResult.error },
        { status: 400 }
      );
    }

    const { scenarioType, params } = validationResult.data;

    // Get user profile
    const userProfile = await prisma.profile.findUnique({
      where: { userId: session.user.id }
    });

    if (!userProfile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const analyzer = new WhatIfAnalyzer();
    const impact = await analyzer.analyzeScenario(userProfile.id, {
      ...params,
      adjustedDeadlines: params.adjustedDeadlines?.map((d: string) => new Date(d)),
      timeBlocks: params.timeBlocks?.map((block: any) => ({
        start: new Date(block.start),
        end: new Date(block.end)
      }))
    });

    return NextResponse.json(impact);
  } catch (error) {
    console.error('Error in what-if analysis:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
