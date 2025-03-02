import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format as formatDate } from "date-fns";

/**
 * Combines class names with Tailwind CSS classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a date to a readable string
 */
export function formatDateString(date: Date | string | null | undefined, format: string = "MMM dd, yyyy"): string {
  if (!date) return "No date";
  return formatDate(new Date(date), format);
}

/**
 * Creates a delay for the specified milliseconds
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Prioritizes tasks by due date and priority
 */
export function prioritizeTasks<T extends { dueDate?: Date | string | null; priority?: string }>(tasks: T[]): T[] {
  return [...tasks].sort((a, b) => {
    // First sort by due date (null dates go to the end)
    if (a.dueDate && !b.dueDate) return -1;
    if (!a.dueDate && b.dueDate) return 1;
    
    if (a.dueDate && b.dueDate) {
      const dateA = new Date(a.dueDate);
      const dateB = new Date(b.dueDate);
      if (dateA < dateB) return -1;
      if (dateA > dateB) return 1;
    }
    
    // Then sort by priority
    const priorityOrder = { HIGH: 0, MEDIUM: 1, LOW: 2 };
    const priorityA = a.priority ? priorityOrder[a.priority as keyof typeof priorityOrder] : 3;
    const priorityB = b.priority ? priorityOrder[b.priority as keyof typeof priorityOrder] : 3;
    
    return priorityA - priorityB;
  });
}

/**
 * Truncates a string to the specified length and adds ellipsis
 */
export function truncateString(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + "...";
}

/**
 * Generates a random color
 */
export function getRandomColor(): string {
  return `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
}

/**
 * Groups tasks by category
 */
export function groupByCategory<T extends { category?: { id: string; name: string } | null }>(
  items: T[]
): Record<string, T[]> {
  return items.reduce((acc, item) => {
    const categoryName = item.category?.name || "Uncategorized";
    if (!acc[categoryName]) {
      acc[categoryName] = [];
    }
    acc[categoryName].push(item);
    return acc;
  }, {} as Record<string, T[]>);
}

/**
 * Groups tasks by status
 */
export function groupByStatus<T extends { status: string }>(items: T[]): Record<string, T[]> {
  return items.reduce((acc, item) => {
    if (!acc[item.status]) {
      acc[item.status] = [];
    }
    acc[item.status].push(item);
    return acc;
  }, {} as Record<string, T[]>);
}
