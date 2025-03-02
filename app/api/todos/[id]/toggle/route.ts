import { NextRequest, NextResponse } from 'next/server';
import * as TodoService from '@/lib/services/todo-service';

// TodoのCompletedステータスを切り替える
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const updatedTodo = await TodoService.toggleTodoStatus(params.id);
    return NextResponse.json(updatedTodo);
  } catch (error) {
    console.error(`Error toggling todo status ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to toggle todo status' },
      { status: 500 }
    );
  }
}
