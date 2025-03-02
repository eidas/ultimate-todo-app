import { NextRequest, NextResponse } from 'next/server';
import * as TodoService from '@/lib/services/todo-service';
import { ZodError, z } from 'zod';

// バリデーションスキーマ
const todoUpdateSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }).optional(),
  description: z.string().optional(),
  status: z.string().optional(),
  priority: z.string().optional(),
  dueDate: z.string().nullable().optional().transform(val => val ? new Date(val) : null),
  categoryId: z.string().nullable().optional(),
  tagIds: z.array(z.string()).optional(),
  completed: z.boolean().optional(),
});

// 特定のTodoを取得
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const todo = await TodoService.getTodoById(params.id);
    
    if (!todo) {
      return NextResponse.json(
        { error: 'Todo not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(todo);
  } catch (error) {
    console.error(`Error fetching todo ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch todo' },
      { status: 500 }
    );
  }
}

// Todoを更新
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    
    // 入力データの検証
    const validatedData = todoUpdateSchema.parse(body);
    
    const updatedTodo = await TodoService.updateTodo(params.id, validatedData);
    return NextResponse.json(updatedTodo);
  } catch (error) {
    console.error(`Error updating todo ${params.id}:`, error);
    
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to update todo' },
      { status: 500 }
    );
  }
}

// Todoを削除
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await TodoService.deleteTodo(params.id);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error(`Error deleting todo ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to delete todo' },
      { status: 500 }
    );
  }
}
