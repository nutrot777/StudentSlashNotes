import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Block } from "@shared/schema";

interface SortableBlockProps {
  block: Block;
  children: React.ReactNode;
}

export default function SortableBlock({ block, children }: SortableBlockProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group ${isDragging ? 'z-50' : ''}`}
    >
      <div
        className="absolute left-0 top-0 bottom-0 w-6 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <div className="w-1 h-4 bg-gray-400 rounded-full"></div>
        <div className="w-1 h-4 bg-gray-400 rounded-full ml-1"></div>
      </div>
      <div className="pl-8">
        {children}
      </div>
    </div>
  );
}