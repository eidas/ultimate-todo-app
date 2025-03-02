import { NextRequest, NextResponse } from 'next/server';
import * as TagService from '@/lib/services/tag-service';
import { ZodError, z } from 'zod';

// バリデーションスキーマ
const tagUpdateSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }).optional(),
  color: z.string().optional(),
});

// 特定のタグを取得
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const tag = await TagService.getTagById(params.id);
    
    if (!tag) {
      return NextResponse.json(
        { error: 'Tag not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(tag);
  } catch (error) {
    console.error(`Error fetching tag ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch tag' },
      { status: 500 }
    );
  }
}

// タグを更新
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    
    // 入力データの検証
    const validatedData = tagUpdateSchema.parse(body);
    
    const updatedTag = await TagService.updateTag(params.id, validatedData);
    return NextResponse.json(updatedTag);
  } catch (error) {
    console.error(`Error updating tag ${params.id}:`, error);
    
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to update tag' },
      { status: 500 }
    );
  }
}

// タグを削除
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await TagService.deleteTag(params.id);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error(`Error deleting tag ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to delete tag' },
      { status: 500 }
    );
  }
}
