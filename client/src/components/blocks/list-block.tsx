import { GripVertical } from "lucide-react";
import type { Block } from "@shared/schema";

interface ListBlockProps {
  block: Block;
  onUpdate: (blockId: string, updates: Partial<Block>) => void;
  onKeyDown: (e: KeyboardEvent, blockId: string) => void;
}

export default function ListBlock({ block, onUpdate, onKeyDown }: ListBlockProps) {
  const items = block.content.split('\n').filter(item => item.trim());

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    const content = (e.target as HTMLElement).textContent || "";
    onUpdate(block.id, { content });
  };

  const isNumbered = block.type === 'numbered-list';

  return (
    <div className="group relative block-hover" data-block-type={block.type}>
      <div className="absolute -left-6 top-1 drag-handle">
        <button className="w-4 h-4 text-muted-foreground hover:text-foreground" title="Drag to reorder">
          <GripVertical className="w-3 h-3" />
        </button>
      </div>
      <div className="pl-4">
        {isNumbered ? (
          <ol className="space-y-2 list-decimal">
            <li>
              <div
                data-block-id={block.id}
                className="content-editable outline-none"
                contentEditable
                suppressContentEditableWarning
                onInput={handleInput}
                onKeyDown={(e) => onKeyDown(e.nativeEvent, block.id)}
                placeholder="List item..."
              >
                {block.content}
              </div>
            </li>
          </ol>
        ) : (
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full mt-2 flex-shrink-0" />
              <div
                data-block-id={block.id}
                className="content-editable outline-none flex-1"
                contentEditable
                suppressContentEditableWarning
                onInput={handleInput}
                onKeyDown={(e) => onKeyDown(e.nativeEvent, block.id)}
                placeholder="List item..."
              >
                {block.content}
              </div>
            </li>
          </ul>
        )}
      </div>
    </div>
  );
}
