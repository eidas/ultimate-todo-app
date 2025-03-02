import { NextRequest, NextResponse } from 'next/server';
import * as CategoryService from '@/lib/services/category-service';
import { ZodError, z } from 'zod';

// バリデーションスキーマ
const categoryUpdateSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }).optional(),
  color: z.string().optional(),
});

// 特定のカテゴリを取得
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const category = await CategoryService.getCategoryById(params.id);
    
    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(category);
  } catch (error) {
    console.error(`Error fetching category ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch category' },
      { status: 500 }
    );
  }
}

// カテゴリを更新
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    
    // 入力データの検証
    const validatedData = categoryUpdateSchema.parse(body);
    
    const updatedCategory = await CategoryService.updateCategory(params.id, validatedData);
    return NextResponse.json(updatedCategory);
  } catch (error) {
    console.error(`Error updating category ${params.id}:`, error);
    
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to update category' },
      { status: 500 }
    );
  }
}

// カテゴリを削除
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await CategoryService.deleteCategory(params.id);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error(`Error deleting category ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to delete category' },
      { status: 500 }
    );
  }
}
