"use client";

import { useState } from "react";
import { TodoItem } from "./todo-item";
import { TodoForm } from "./todo-form";
import { TodoWithRelations } from "@/lib/services/todo-service";
import { CategoryWithCount } from "@/lib/services/category-service";
import { TagWithCount } from "@/lib/services/tag-service";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface TodoListProps {
  initialTodos: TodoWithRelations[];
  categories: CategoryWithCount[];
  tags: TagWithCount[];
  onAddTodo: (formData: FormData) => Promise<void>;
  onUpdateTodo: (formData: FormData) => Promise<void>;
  onDeleteTodo: (id: string) => Promise<void>;
  onToggleTodoStatus: (id: string) => Promise<void>;
}

export function TodoList({
  initialTodos,
  categories,
  tags,
  onAddTodo,
  onUpdateTodo,
  onDeleteTodo,
  onToggleTodoStatus,
}: TodoListProps) {
  const [todos, setTodos] = useState<TodoWithRelations[]>(initialTodos);
  const [editingTodo, setEditingTodo] = useState<TodoWithRelations | undefined>();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterTag, setFilterTag] = useState<string>("all");
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("dueDate");

  // Update local todos when initialTodos changes
  if (JSON.stringify(initialTodos) !== JSON.stringify(todos)) {
    setTodos(initialTodos);
  }

  const handleEdit = (todo: TodoWithRelations) => {
    setEditingTodo(todo);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await onDeleteTodo(id);
      setTodos(todos.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  const handleFormSubmit = async (formData: FormData) => {
    try {
      // If we are editing a todo, we update it
      if (editingTodo) {
        await onUpdateTodo(formData);
      } else {
        // Otherwise, we are adding a new todo
        await onAddTodo(formData);
      }
    } catch (error) {
      console.error("Error submitting todo form:", error);
    }
  };

  const handleToggleComplete = async (id: string) => {
    try {
      await onToggleTodoStatus(id);
      // The actual update will come from the server via the initialTodos prop
    } catch (error) {
      console.error("Error toggling todo status:", error);
    }
  };

  const handleAddNewClick = () => {
    setEditingTodo(undefined);
    setIsFormOpen(true);
  };

  const filteredTodos = todos
    .filter((todo) => {
      const matchesSearch = searchTerm === "" || 
        todo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (todo.description && todo.description.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = filterCategory === "all" || 
        (filterCategory === "none" && !todo.categoryId) ||
        todo.categoryId === filterCategory;
      
      const matchesStatus = filterStatus === "all" ||
        todo.status === filterStatus ||
        (filterStatus === "completed" && todo.completed) ||
        (filterStatus === "active" && !todo.completed);
      
      const matchesTag = filterTag === "all" ||
        (filterTag === "none" && (!todo.tags || todo.tags.length === 0)) ||
        todo.tags?.some(({ tag }) => tag.id === filterTag);
      
      const matchesPriority = filterPriority === "all" ||
        todo.priority === filterPriority;
      
      return matchesSearch && matchesCategory && matchesStatus && matchesTag && matchesPriority;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "dueDate":
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        case "priority":
          const priorityOrder = { HIGH: 0, MEDIUM: 1, LOW: 2 };
          return priorityOrder[a.priority as keyof typeof priorityOrder] - 
                 priorityOrder[b.priority as keyof typeof priorityOrder];
        case "title":
          return a.title.localeCompare(b.title);
        case "createdAt":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return 0;
      }
    });

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Search className="h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleAddNewClick} size="sm">
              Add Task
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Select
                value={filterCategory}
                onValueChange={setFilterCategory}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="none">Uncategorized</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Select
                value={filterStatus}
                onValueChange={setFilterStatus}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="TODO">To Do</SelectItem>
                  <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                  <SelectItem value="DONE">Done</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Select
                value={filterTag}
                onValueChange={setFilterTag}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by tag" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tags</SelectItem>
                  <SelectItem value="none">No Tags</SelectItem>
                  {tags.map((tag) => (
                    <SelectItem key={tag.id} value={tag.id}>
                      {tag.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Select
                value={sortBy}
                onValueChange={setSortBy}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dueDate">Due Date</SelectItem>
                  <SelectItem value="priority">Priority</SelectItem>
                  <SelectItem value="title">Title</SelectItem>
                  <SelectItem value="createdAt">Created Date</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="text-sm font-medium text-muted-foreground">Filters:</span>
            {filterCategory !== "all" && (
              <Badge 
                variant="outline"
                className="cursor-pointer"
                onClick={() => setFilterCategory("all")}
              >
                Category: {filterCategory === "none" 
                  ? "None" 
                  : categories.find(c => c.id === filterCategory)?.name || "Unknown"}
                <span className="ml-1">×</span>
              </Badge>
            )}
            {filterStatus !== "all" && (
              <Badge 
                variant="outline"
                className="cursor-pointer"
                onClick={() => setFilterStatus("all")}
              >
                Status: {filterStatus}
                <span className="ml-1">×</span>
              </Badge>
            )}
            {filterTag !== "all" && (
              <Badge 
                variant="outline"
                className="cursor-pointer"
                onClick={() => setFilterTag("all")}
              >
                Tag: {filterTag === "none" 
                  ? "None" 
                  : tags.find(t => t.id === filterTag)?.name || "Unknown"}
                <span className="ml-1">×</span>
              </Badge>
            )}
            {filterPriority !== "all" && (
              <Badge 
                variant="outline"
                className="cursor-pointer"
                onClick={() => setFilterPriority("all")}
              >
                Priority: {filterPriority}
                <span className="ml-1">×</span>
              </Badge>
            )}
            {(filterCategory !== "all" || filterStatus !== "all" || filterTag !== "all" || filterPriority !== "all") && (
              <Badge 
                variant="outline"
                className="cursor-pointer"
                onClick={() => {
                  setFilterCategory("all");
                  setFilterStatus("all");
                  setFilterTag("all");
                  setFilterPriority("all");
                }}
              >
                Clear All
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {filteredTodos.length === 0 ? (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No tasks found</AlertTitle>
          <AlertDescription>
            {searchTerm || filterCategory !== "all" || filterStatus !== "all" || filterTag !== "all" || filterPriority !== "all"
              ? "Try changing your filters or creating a new task."
              : "Get started by creating your first task."}
          </AlertDescription>
        </Alert>
      ) : (
        <div>
          <h2 className="text-xl font-bold mb-4">
            Tasks ({filteredTodos.length})
          </h2>
          <div className="space-y-2">
            {filteredTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onDelete={handleDelete}
                onEdit={handleEdit}
                onToggleComplete={handleToggleComplete}
              />
            ))}
          </div>
        </div>
      )}

      <TodoForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        todo={editingTodo}
        categories={categories}
        tags={tags}
      />
    </div>
  );
}
