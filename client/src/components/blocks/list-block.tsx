import { GripVertical } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { Block } from "@shared/schema";

interface ListBlockProps {
  block: Block;
  onUpdate: (blockId: string, updates: Partial<Block>) => void;
  onKeyDown: (e: KeyboardEvent, blockId: string) => void;
  blocks?: Block[];
}

export default function ListBlock({ block, onUpdate, onKeyDown, blocks = [] }: ListBlockProps) {
  // Calculate list number by counting previous numbered list items
  const getListNumber = () => {
    const currentIndex = blocks.findIndex(b => b.id === block.id);
    let listNumber = 1;
    
    for (let i = 0; i < currentIndex; i++) {
      if (blocks[i].type === 'numbered-list') {
        listNumber++;
      } else if (blocks[i].type !== 'numbered-list') {
        // Reset numbering if there's a non-list block
        listNumber = 1;
      }
    }
    
    return listNumber;
  };

  const isNumbered = block.type === 'numbered-list';

  return (
    <div className="group relative block-hover" data-block-type={block.type}>
      <div className="absolute -left-6 top-1 drag-handle">
        <button className="w-4 h-4 text-muted-foreground hover:text-foreground" title="Drag to reorder">
          <GripVertical className="w-3 h-3" />
        </button>
      </div>
      <div className="flex items-start gap-3">
        {isNumbered ? (
          <span className="text-muted-foreground mt-2 text-sm min-w-[20px]">{getListNumber()}.</span>
        ) : (
          <span className="w-2 h-2 bg-muted-foreground rounded-full mt-3 flex-shrink-0" />
        )}
        <Input
          data-block-id={block.id}
          value={block.content}
          onChange={(e) => {
            onUpdate(block.id, { content: e.target.value });
          }}
          onKeyDown={(e) => onKeyDown(e.nativeEvent, block.id)}
          placeholder="List item..."
          className="border-none shadow-none p-0 h-auto focus-visible:ring-0 flex-1"
        />
      </div>
    </div>
  );
}
