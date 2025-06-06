import { GripVertical } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import type { Block } from "@shared/schema";

interface CheckboxBlockProps {
  block: Block;
  onUpdate: (blockId: string, updates: Partial<Block>) => void;
  onKeyDown: (e: KeyboardEvent, blockId: string) => void;
}

export default function CheckboxBlock({ block, onUpdate, onKeyDown }: CheckboxBlockProps) {
  const metadata = block.metadata || {};
  const isChecked = metadata.checked === true;

  const toggleChecked = () => {
    onUpdate(block.id, {
      metadata: { ...metadata, checked: !isChecked }
    });
  };

  return (
    <div className="group relative block-hover" data-block-type="checkbox-list">
      <div className="absolute -left-6 top-1 drag-handle">
        <button className="w-4 h-4 text-muted-foreground hover:text-foreground" title="Drag to reorder">
          <GripVertical className="w-3 h-3" />
        </button>
      </div>
      <div className="flex items-center gap-3">
        <Checkbox 
          checked={isChecked}
          onCheckedChange={toggleChecked}
        />
        <Input
          data-block-id={block.id}
          value={block.content}
          onChange={(e) => {
            onUpdate(block.id, { content: e.target.value });
          }}
          onKeyDown={(e) => onKeyDown(e.nativeEvent, block.id)}
          placeholder="Todo item..."
          className={`border-none shadow-none p-0 h-auto focus-visible:ring-0 ${
            isChecked ? 'line-through text-muted-foreground' : ''
          }`}
        />
      </div>
    </div>
  );
}
