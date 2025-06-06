import { GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Block } from "@shared/schema";

interface HeadingBlockProps {
  block: Block;
  onUpdate: (blockId: string, updates: Partial<Block>) => void;
  onKeyDown: (e: KeyboardEvent, blockId: string) => void;
}

export default function HeadingBlock({ block, onUpdate, onKeyDown }: HeadingBlockProps) {
  const getHeadingClass = () => {
    switch (block.type) {
      case 'heading-1':
        return 'text-3xl font-bold';
      case 'heading-2':
        return 'text-2xl font-semibold';
      case 'heading-3':
        return 'text-xl font-medium';
      default:
        return 'text-3xl font-bold';
    }
  };

  return (
    <div className="group relative block-hover" data-block-type={block.type}>
      <div className="absolute -left-6 top-1 drag-handle">
        <button className="w-4 h-4 text-muted-foreground hover:text-foreground" title="Drag to reorder">
          <GripVertical className="w-3 h-3" />
        </button>
      </div>
      <h1
        data-block-id={block.id}
        className={cn(
          getHeadingClass(),
          "text-secondary-foreground mb-2 content-editable outline-none"
        )}
        contentEditable
        suppressContentEditableWarning
        onInput={(e) => {
          const content = (e.target as HTMLElement).textContent || "";
          onUpdate(block.id, { content });
        }}
        onKeyDown={(e) => onKeyDown(e.nativeEvent, block.id)}
        placeholder={`Heading ${block.type.split('-')[1]}`}
      >
        {block.content}
      </h1>
    </div>
  );
}
