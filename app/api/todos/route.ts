import { NextRequest, NextResponse } from 'next/server';
import * as TodoService from '@/lib/services/todo-service';
import { ZodError, z } from 'zod';

// バリデーションスキーマ
const todoSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  description: z.string().optional().nullable(),
  status: z.string().optional(),
  priority: z.string().optional(),
  dueDate: z.string().nullable().optional().transform(val => val ? new Date(val) : null),
  categoryId: z.string().nullable().optional(),
  tagIds: z.array(z.string()).optional(),
  completed: z.boolean().optional(),
});

// すべてのTodoを取得
export async function GET() {
  try {
    const todos = await TodoService.getTodos();
    return NextResponse.json(todos);
  } catch (error) {
    console.error('Error fetching todos:', error);
    return NextResponse.json(
      { error: 'Failed to fetch todos' },
      { status: 500 }
    );
  }
}

// 新しいTodoを作成
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Received todo data:', body);
    
    // 入力データの検証
    const validatedData = todoSchema.parse(body);
    console.log('Validated todo data:', validatedData);
    
    const newTodo = await TodoService.createTodo(validatedData);
    return NextResponse.json(newTodo, { status: 201 });
  } catch (error) {
    console.error('Error creating todo:', error);
    
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create todo', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
