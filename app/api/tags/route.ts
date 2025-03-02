import { NextRequest, NextResponse } from 'next/server';
import * as TagService from '@/lib/services/tag-service';
import { ZodError, z } from 'zod';

// バリデーションスキーマ
const tagSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  color: z.string().optional(),
});

// すべてのタグを取得
export async function GET() {
  try {
    const tags = await TagService.getTags();
    return NextResponse.json(tags);
  } catch (error) {
    console.error('Error fetching tags:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tags' },
      { status: 500 }
    );
  }
}

// 新しいタグを作成
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // 入力データの検証
    const validatedData = tagSchema.parse(body);
    
    const newTag = await TagService.createTag(validatedData);
    return NextResponse.json(newTag, { status: 201 });
  } catch (error) {
    console.error('Error creating tag:', error);
    
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create tag' },
      { status: 500 }
    );
  }
}
