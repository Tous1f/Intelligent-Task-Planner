import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { GeminiClient } from '@/lib/ai/gemini-client';

export async function POST(request: Request) {
  const session = await getServerSession();

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { tasks } = await request.json();
    const gemini = new GeminiClient();

    // Prepare tasks data for analysis
    const tasksData = tasks.map((task: any) => ({
      title: task.title,
      date: new Date(task.date).toISOString(),
      source: task.source,
      priority: task.priority
    }));

    // Generate insights using Gemini AI
    const insights = await generateInsights(gemini, tasksData);

    return NextResponse.json({ insights });
  } catch (error) {
    console.error('Error generating calendar insights:', error);
    return NextResponse.json(
      { error: 'Failed to generate insights' },
      { status: 500 }
    );
  }
}

async function generateInsights(gemini: GeminiClient, tasks: any[]) {
  const prompt = `Analyze the following schedule and tasks to provide meaningful insights:
${JSON.stringify(tasks, null, 2)}

Please provide 3 insights about:
1. Schedule patterns and potential improvements
2. Task distribution and workload balance
3. Time management recommendations

For each insight, include:
- A clear title
- A helpful description
- A confidence score (0.0 to 1.0)
- The type of insight (scheduling, pattern, or suggestion)`;

  const response = await gemini.getCompletion(prompt);
  
  try {
    // Parse the AI response into structured insights
  const insightMatches = response.match(/(\d\.[\s\S]*?)(?=\d\.|$)/g);
    
    if (!insightMatches) {
      throw new Error('Could not parse insights from AI response');
    }

    return insightMatches.map(match => {
      const titleMatch = match.match(/\d\.\s*(.*?)[\n\r]/);
  const descriptionMatch = match.match(/Description:?\s*([\s\S]*?)(?=Confidence|$)/i);
      const confidenceMatch = match.match(/Confidence:?\s*(0\.\d+)/i);
      const typeMatch = match.match(/Type:?\s*(scheduling|pattern|suggestion)/i);

      return {
        title: titleMatch?.[1]?.trim() || 'Insight',
        description: descriptionMatch?.[1]?.trim() || 'No description available',
        confidence: parseFloat(confidenceMatch?.[1] || '0.7'),
        type: (typeMatch?.[1]?.toLowerCase() || 'suggestion') as 'scheduling' | 'pattern' | 'suggestion'
      };
    });
  } catch (error) {
    console.error('Error parsing AI insights:', error);
    return [];
  }
}
