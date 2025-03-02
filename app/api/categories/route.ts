import { NextRequest, NextResponse } from 'next/server';
import * as CategoryService from '@/lib/services/category-service';
import { ZodError, z } from 'zod';

// バリデーションスキーマ
const categorySchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  color: z.string().optional(),
});

// すべてのカテゴリを取得
export async function GET() {
  try {
    const categories = await CategoryService.getCategories();
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

// 新しいカテゴリを作成
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // 入力データの検証
    const validatedData = categorySchema.parse(body);
    
    const newCategory = await CategoryService.createCategory(validatedData);
    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    );
  }
}
