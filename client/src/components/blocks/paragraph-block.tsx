import { GripVertical } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import type { Block } from "@shared/schema";

interface ParagraphBlockProps {
  block: Block;
  onUpdate: (blockId: string, updates: Partial<Block>) => void;
  onKeyDown: (e: KeyboardEvent, blockId: string) => void;
}

export default function ParagraphBlock({ block, onUpdate, onKeyDown }: ParagraphBlockProps) {
  return (
    <div className="group relative block-hover" data-block-type="paragraph">
      <div className="absolute -left-6 top-1 drag-handle">
        <button className="w-4 h-4 text-muted-foreground hover:text-foreground" title="Drag to reorder">
          <GripVertical className="w-3 h-3" />
        </button>
      </div>
      <Textarea
        data-block-id={block.id}
        value={block.content}
        onChange={(e) => {
          onUpdate(block.id, { content: e.target.value });
        }}
        onKeyDown={(e) => onKeyDown(e.nativeEvent, block.id)}
        placeholder="Type something..."
        className="min-h-[40px] resize-none border-none shadow-none p-0 focus-visible:ring-0 text-base leading-relaxed overflow-hidden"
        rows={Math.max(1, Math.ceil(block.content.length / 80))}
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      />
    </div>
  );
}
