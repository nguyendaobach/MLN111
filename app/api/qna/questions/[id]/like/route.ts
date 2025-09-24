import { NextRequest, NextResponse } from 'next/server';
import { likeQuestion } from '@/lib/qa-database';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const questionId = params.id;
    const updatedQuestion = likeQuestion(questionId);
    
    if (!updatedQuestion) {
      return NextResponse.json(
        { success: false, error: 'Question not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      question: updatedQuestion 
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to like question' },
      { status: 500 }
    );
  }
}