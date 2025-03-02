import prisma from '../db';
import { Category } from '@prisma/client';
import { getRandomColor } from '../utils';

export type CategoryWithCount = Category & {
  _count: {
    todos: number;
  };
};

export type CategoryCreateInput = {
  name: string;
  color?: string;
};

export type CategoryUpdateInput = Partial<CategoryCreateInput>;

export async function getCategories(): Promise<CategoryWithCount[]> {
  return prisma.category.findMany({
    include: {
      _count: {
        select: {
          todos: true,
        },
      },
    },
    orderBy: {
      name: 'asc',
    },
  });
}

export async function getCategoryById(id: string): Promise<Category | null> {
  return prisma.category.findUnique({
    where: { id },
  });
}

export async function createCategory(data: CategoryCreateInput): Promise<Category> {
  return prisma.category.create({
    data: {
      ...data,
      color: data.color || getRandomColor(),
    },
  });
}

export async function updateCategory(id: string, data: CategoryUpdateInput): Promise<Category> {
  return prisma.category.update({
    where: { id },
    data,
  });
}

export async function deleteCategory(id: string): Promise<Category> {
  return prisma.category.delete({
    where: { id },
  });
}
