"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2, AlertCircle } from "lucide-react";
import { formatDateString, cn } from "@/lib/utils";
import { TodoWithRelations } from "@/lib/services/todo-service";
import { Badge } from "@/components/ui/badge";

interface TodoItemProps {
  todo: TodoWithRelations;
  onDelete: (id: string) => void;
  onEdit: (todo: TodoWithRelations) => void;
  onToggleComplete: (id: string) => Promise<void>;
}

export function TodoItem({
  todo,
  onDelete,
  onEdit,
  onToggleComplete
}: TodoItemProps) {
  const [isCompleting, setIsCompleting] = useState(false);

  const handleToggleComplete = async () => {
    setIsCompleting(true);
    try {
      await onToggleComplete(todo.id);
    } finally {
      setIsCompleting(false);
    }
  };

  const isOverdue = todo.dueDate && new Date(todo.dueDate) < new Date() && !todo.completed;

  const priorityClasses = {
    HIGH: "todo-priority-high",
    MEDIUM: "todo-priority-medium",
    LOW: "todo-priority-low",
  };

  return (
    <Card className={cn(
      "mb-3 transition-all hover:shadow-md",
      todo.completed && "opacity-70",
      priorityClasses[todo.priority as keyof typeof priorityClasses]
    )}>
      <CardContent className="p-4 flex items-start gap-3">
        <div className="flex-shrink-0 pt-1">
          <Checkbox 
            checked={todo.completed} 
            onCheckedChange={handleToggleComplete}
            disabled={isCompleting}
          />
        </div>
        <div className="flex-grow min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className={cn(
              "font-medium text-base truncate",
              todo.completed && "todo-item-completed"
            )}>
              {todo.title}
            </h3>
            <div className="flex items-center gap-1 flex-shrink-0">
              {isOverdue && (
                <span className="text-destructive flex items-center text-xs gap-1">
                  <AlertCircle className="h-3 w-3" />
                  <span>Overdue</span>
                </span>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => onEdit(todo)}
              >
                <Edit2 className="h-4 w-4" />
                <span className="sr-only">Edit</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive hover:text-destructive"
                onClick={() => onDelete(todo.id)}
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete</span>
              </Button>
            </div>
          </div>
          {todo.description && (
            <p className={cn(
              "text-sm text-muted-foreground mt-1",
              todo.completed && "todo-item-completed"
            )}>
              {todo.description}
            </p>
          )}
          <div className="flex flex-wrap mt-2 items-center text-xs gap-2">
            <div className="flex items-center gap-2">
              {todo.dueDate && (
                <span className={cn(
                  "text-muted-foreground",
                  isOverdue && "text-destructive"
                )}>
                  Due: {formatDateString(todo.dueDate)}
                </span>
              )}
              {todo.category && (
                <Badge style={{ backgroundColor: todo.category.color }} variant="secondary" className="text-white">
                  {todo.category.name}
                </Badge>
              )}
              {todo.tags && todo.tags.map(({ tag }) => (
                <Badge key={tag.id} style={{ backgroundColor: tag.color }} variant="outline" className="text-white">
                  {tag.name}
                </Badge>
              ))}
            </div>
            <Badge variant="outline" className="ml-auto">
              {todo.status}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
