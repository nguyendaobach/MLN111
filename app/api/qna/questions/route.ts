import { NextRequest, NextResponse } from 'next/server';
import { getAllQuestions, addQuestion, likeQuestion } from '@/lib/qa-database';

export async function GET() {
  try {
    const questions = getAllQuestions();
    return NextResponse.json({ success: true, questions });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch questions' }, 
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { question, askedBy, group } = body;

    if (!question || !askedBy || !group) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const newQuestion = addQuestion({ question, askedBy, group });
    
    return NextResponse.json({ 
      success: true, 
      question: newQuestion 
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to add question' },
      { status: 500 }
    );
  }
}