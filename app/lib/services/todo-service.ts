import prisma from '../db';
import { Todo } from '@prisma/client';

export type TodoWithRelations = Todo & {
  category: { id: string; name: string; color: string } | null;
  tags: { tag: { id: string; name: string; color: string } }[];
};

export type TodoCreateInput = {
  title: string;
  description?: string | null;
  status?: string;
  priority?: string;
  dueDate?: Date | null;
  categoryId?: string | null;
  tagIds?: string[];
  completed?: boolean;
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
  try {
    console.log('Creating todo with data in service:', data);
    
    const { tagIds, ...todoData } = data;
    
    // If dueDate is provided as an empty string, set it to null
    if (todoData.dueDate === '') {
      todoData.dueDate = null;
    }
    
    // Create the todo with tags if provided
    const createData: any = { ...todoData };
    
    // Only add tags relation if tagIds is provided and not empty
    if (tagIds && tagIds.length > 0) {
      createData.tags = {
        create: tagIds.map((tagId) => ({
          tag: {
            connect: { id: tagId },
          },
        })),
      };
    }
    
    console.log('Final todo create data:', createData);
    
    return prisma.todo.create({
      data: createData,
    });
  } catch (error) {
    console.error('Error in createTodo service:', error);
    throw error;
  }
}

export async function updateTodo(id: string, data: TodoUpdateInput): Promise<Todo> {
  try {
    console.log('Updating todo with data in service:', { id, ...data });
    
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
  } catch (error) {
    console.error('Error in updateTodo service:', error);
    throw error;
  }
}

export async function deleteTodo(id: string): Promise<Todo> {
  try {
    return prisma.todo.delete({
      where: { id },
    });
  } catch (error) {
    console.error('Error in deleteTodo service:', error);
    throw error;
  }
}

export async function toggleTodoStatus(id: string): Promise<Todo> {
  try {
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
  } catch (error) {
    console.error('Error in toggleTodoStatus service:', error);
    throw error;
  }
}
