import prisma from '../db';
import { Tag } from '@prisma/client';
import { getRandomColor } from '../utils';

export type TagWithCount = Tag & {
  _count: {
    todos: number;
  };
};

export type TagCreateInput = {
  name: string;
  color?: string;
};

export type TagUpdateInput = Partial<TagCreateInput>;

export async function getTags(): Promise<TagWithCount[]> {
  return prisma.tag.findMany({
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

export async function getTagById(id: string): Promise<Tag | null> {
  return prisma.tag.findUnique({
    where: { id },
  });
}

export async function createTag(data: TagCreateInput): Promise<Tag> {
  return prisma.tag.create({
    data: {
      ...data,
      color: data.color || getRandomColor(),
    },
  });
}

export async function updateTag(id: string, data: TagUpdateInput): Promise<Tag> {
  return prisma.tag.update({
    where: { id },
    data,
  });
}

export async function deleteTag(id: string): Promise<Tag> {
  return prisma.tag.delete({
    where: { id },
  });
}
