import prisma from '../db';
import { Todo } from '@prisma/client';

export type TodoWithRelations = Todo & {
  category: { id: string; name: string; color: string } | null;
  tags: { tag: { id: string; name: string; color: string } }[];
};

export type TodoCreateInput = {
  title: string;
  description?: string;
  status?: string;
  priority?: string;
  dueDate?: Date | null;
  categoryId?: string | null;
  tagIds?: string[];
};

export type TodoUpdateInput = Partial<TodoCreateInput> & {
  completed?: boolean;
};

export async function getTodos(): Promise<TodoWithRelations[]> {
  return prisma.todo.findMany({
    include: {
      category: {
        select: {
          id: true,
          name: true,
          color: true,
        },
      },
      tags: {
        select: {
          tag: {
            select: {
              id: true,
              name: true,
              color: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}

export async function getTodoById(id: string): Promise<TodoWithRelations | null> {
  return prisma.todo.findUnique({
    where: { id },
    include: {
      category: {
        select: {
          id: true,
          name: true,
          color: true,
        },
      },
      tags: {
        select: {
          tag: {
            select: {
              id: true,
              name: true,
              color: true,
            },
          },
        },
      },
    },
  });
}

export async function createTodo(data: TodoCreateInput): Promise<Todo> {
  const { tagIds, ...todoData } = data;
  
  // If dueDate is provided as an empty string, set it to null
  if (todoData.dueDate === '') {
    todoData.dueDate = null;
  }
  
  return prisma.todo.create({
    data: {
      ...todoData,
      ...(tagIds && tagIds.length > 0
        ? {
            tags: {
              create: tagIds.map((tagId) => ({
                tag: {
                  connect: { id: tagId },
                },
              })),
            },
          }
        : {}),
    },
  });
}

export async function updateTodo(id: string, data: TodoUpdateInput): Promise<Todo> {
  const { tagIds, ...todoData } = data;

  // If dueDate is provided as an empty string, set it to null
  if (todoData.dueDate === '') {
    todoData.dueDate = null;
  }

  // First update the todo itself
  const updatedTodo = await prisma.todo.update({
    where: { id },
    data: todoData,
  });

  // If tagIds is provided, update the tags
  if (tagIds !== undefined) {
    // First delete all existing tag relations
    await prisma.tagsOnTodos.deleteMany({
      where: { todoId: id },
    });

    // Then create new tag relations
    if (tagIds.length > 0) {
      await prisma.tagsOnTodos.createMany({
        data: tagIds.map((tagId) => ({
          todoId: id,
          tagId,
        })),
      });
    }
  }

  return updatedTodo;
}

export async function deleteTodo(id: string): Promise<Todo> {
  return prisma.todo.delete({
    where: { id },
  });
}

export async function toggleTodoStatus(id: string): Promise<Todo> {
  const todo = await prisma.todo.findUnique({
    where: { id },
    select: { completed: true },
  });

  if (!todo) throw new Error(`Todo with ID ${id} not found`);

  return prisma.todo.update({
    where: { id },
    data: { 
      completed: !todo.completed,
      status: !todo.completed ? 'DONE' : 'TODO'
    },
  });
}
