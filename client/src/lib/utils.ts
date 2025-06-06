import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTimeAgo(date: Date | string): string {
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return `${diffInSeconds}s ago`;
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays}d ago`;
  }

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks}w ago`;
  }

  return past.toLocaleDateString();
}

export function generateId(): string {
  return `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function getBlockPreview(blocks: any[]): string {
  if (!Array.isArray(blocks) || blocks.length === 0) {
    return "Empty note";
  }

  // Find first content block with text
  const contentBlock = blocks.find(block => 
    block.content && 
    block.content.trim().length > 0 &&
    block.type !== 'heading-1'
  );

  if (!contentBlock) {
    return "Empty note";
  }

  const content = contentBlock.content.trim();
  return content.length > 100 ? `${content.substring(0, 97)}...` : content;
}

export function countBlocks(blocks: any[]): number {
  return Array.isArray(blocks) ? blocks.length : 0;
}
