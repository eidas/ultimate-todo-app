"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/layout/header";
import { TodoList } from "@/components/todo/todo-list";
import { useToast } from "@/hooks/use-toast";
import { TodoWithRelations } from "@/lib/services/todo-service";
import { CategoryWithCount } from "@/lib/services/category-service";
import { TagWithCount } from "@/lib/services/tag-service";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [todos, setTodos] = useState<TodoWithRelations[]>([]);
  const [categories, setCategories] = useState<CategoryWithCount[]>([]);
  const [tags, setTags] = useState<TagWithCount[]>([]);
  const [showTodoForm, setShowTodoForm] = useState(false);
  const { toast } = useToast();

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch todos
        const todosResponse = await fetch("/api/todos");
        if (!todosResponse.ok) throw new Error("Failed to fetch todos");
        const todosData = await todosResponse.json();
        setTodos(todosData);

        // Fetch categories
        const categoriesResponse = await fetch("/api/categories");
        if (!categoriesResponse.ok) throw new Error("Failed to fetch categories");
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData);

        // Fetch tags
        const tagsResponse = await fetch("/api/tags");
        if (!tagsResponse.ok) throw new Error("Failed to fetch tags");
        const tagsData = await tagsResponse.json();
        setTags(tagsData);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: "Failed to load data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  // Handle adding a new todo
  const handleAddTodo = async (formData: FormData) => {
    try {
      // Convert FormData to JSON
      const data: Record<string, any> = {};
      formData.forEach((value, key) => {
        if (key === "tagIds") {
          if (!data[key]) data[key] = [];
          data[key].push(value);
        } else {
          data[key] = value;
        }
      });

      // Handle boolean and date conversions
      if (data.completed === "true") data.completed = true;
      if (data.completed === "false") data.completed = false;
      if (data.dueDate === "") data.dueDate = null;

      // Handle categoryId "none" to null conversion
      if (data.categoryId === "none") data.categoryId = null;

      console.log("Creating todo with data:", data);

      // Make API request
      const response = await fetch("/api/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Server error:", errorData);
        throw new Error(errorData.error || "Failed to create todo");
      }

      // Refresh the todo list
      const todosResponse = await fetch("/api/todos");
      if (!todosResponse.ok) throw new Error("Failed to fetch updated todos");
      const todosData = await todosResponse.json();
      setTodos(todosData);

      toast({
        title: "Success",
        description: "Task created successfully",
      });
    } catch (error) {
      console.error("Error adding todo:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create task. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle updating a todo
  const handleUpdateTodo = async (formData: FormData) => {
    try {
      // Extract the todo ID and convert FormData to JSON
      const id = formData.get("id") as string;
      const data: Record<string, any> = {};
      formData.forEach((value, key) => {
        if (key === "id") return; // Skip ID since it's in the URL
        if (key === "tagIds") {
          if (!data[key]) data[key] = [];
          data[key].push(value);
        } else {
          data[key] = value;
        }
      });

      // Handle boolean and date conversions
      if (data.completed === "true") data.completed = true;
      if (data.completed === "false") data.completed = false;
      if (data.dueDate === "") data.dueDate = null;

      // Handle categoryId "none" to null conversion
      if (data.categoryId === "none") data.categoryId = null;

      console.log("Updating todo with data:", data);

      // Make API request
      const response = await fetch(`/api/todos/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Server error:", errorData);
        throw new Error(errorData.error || "Failed to update todo");
      }

      // Refresh the todo list
      const todosResponse = await fetch("/api/todos");
      if (!todosResponse.ok) throw new Error("Failed to fetch updated todos");
      const todosData = await todosResponse.json();
      setTodos(todosData);

      toast({
        title: "Success",
        description: "Task updated successfully",
      });
    } catch (error) {
      console.error("Error updating todo:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update task. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle deleting a todo
  const handleDeleteTodo = async (id: string) => {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete todo");
      }

      // Update local state by filtering out the deleted todo
      setTodos((prev) => prev.filter((todo) => todo.id !== id));

      toast({
        title: "Success",
        description: "Task deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting todo:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete task. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle toggling a todo's completed status
  const handleToggleTodoStatus = async (id: string) => {
    try {
      const response = await fetch(`/api/todos/${id}/toggle`, {
        method: "POST",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to toggle todo status");
      }

      // Refresh the todo list
      const todosResponse = await fetch("/api/todos");
      if (!todosResponse.ok) throw new Error("Failed to fetch updated todos");
      const todosData = await todosResponse.json();
      setTodos(todosData);

      // No toast for this common operation to avoid UI noise
    } catch (error) {
      console.error("Error toggling todo status:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update task status. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header onAddTodo={() => setShowTodoForm(true)} />
      <main className="flex-1 container mx-auto py-6 px-4">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <TodoList
            initialTodos={todos}
            categories={categories}
            tags={tags}
            onAddTodo={handleAddTodo}
            onUpdateTodo={handleUpdateTodo}
            onDeleteTodo={handleDeleteTodo}
            onToggleTodoStatus={handleToggleTodoStatus}
          />
        )}
      </main>
      <footer className="border-t py-4 text-center text-sm text-muted-foreground">
        <div className="container mx-auto">
          Ultimate Todo App &copy; {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
}
