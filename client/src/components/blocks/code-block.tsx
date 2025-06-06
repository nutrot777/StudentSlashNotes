import { GripVertical, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Block } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

interface CodeBlockProps {
  block: Block;
  onUpdate: (blockId: string, updates: Partial<Block>) => void;
  onKeyDown: (e: KeyboardEvent, blockId: string) => void;
}

export default function CodeBlock({ block, onUpdate, onKeyDown }: CodeBlockProps) {
  const { toast } = useToast();

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(block.content);
      toast({
        title: "Copied!",
        description: "Code copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy code",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="group relative block-hover" data-block-type="code">
      <div className="absolute -left-6 top-1 drag-handle">
        <button className="w-4 h-4 text-muted-foreground hover:text-foreground" title="Drag to reorder">
          <GripVertical className="w-3 h-3" />
        </button>
      </div>
      <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm">
        <div className="flex items-center justify-between mb-3">
          <span className="text-gray-400 text-xs">Code</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={copyToClipboard}
            className="text-gray-400 hover:text-white text-xs h-auto p-1"
          >
            <Copy className="w-3 h-3" />
          </Button>
        </div>
        <pre
          data-block-id={block.id}
          className="text-gray-300 content-editable outline-none whitespace-pre-wrap"
          contentEditable
          suppressContentEditableWarning
          onInput={(e) => {
            const content = (e.target as HTMLElement).textContent || "";
            onUpdate(block.id, { content });
          }}
          onKeyDown={(e) => onKeyDown(e.nativeEvent, block.id)}
          placeholder="Enter your code..."
        >
          {block.content}
        </pre>
      </div>
    </div>
  );
}
