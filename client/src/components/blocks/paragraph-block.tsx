import { useRef, useEffect } from "react";
import { GripVertical } from "lucide-react";
import type { Block } from "@shared/schema";

interface ParagraphBlockProps {
  block: Block;
  onUpdate: (blockId: string, updates: Partial<Block>) => void;
  onKeyDown: (e: KeyboardEvent, blockId: string) => void;
}

export default function ParagraphBlock({ block, onUpdate, onKeyDown }: ParagraphBlockProps) {
  const elementRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (elementRef.current && elementRef.current.textContent !== block.content) {
      elementRef.current.textContent = block.content;
    }
  }, [block.content]);

  return (
    <div className="group relative block-hover" data-block-type="paragraph">
      <div className="absolute -left-6 top-1 drag-handle">
        <button className="w-4 h-4 text-muted-foreground hover:text-foreground" title="Drag to reorder">
          <GripVertical className="w-3 h-3" />
        </button>
      </div>
      <p
        ref={elementRef}
        data-block-id={block.id}
        className="text-base leading-relaxed content-editable outline-none min-h-[24px]"
        contentEditable
        suppressContentEditableWarning
        onInput={(e) => {
          const content = (e.target as HTMLElement).textContent || "";
          onUpdate(block.id, { content });
        }}
        onKeyDown={(e) => onKeyDown(e.nativeEvent, block.id)}
        data-placeholder={block.content === "" ? "Type something..." : ""}
      />
    </div>
  );
}
