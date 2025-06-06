import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Note, Block } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useAutoSave } from "@/hooks/use-auto-save";
import { generateId } from "@/lib/utils";
import SlashMenu from "./slash-menu";
import HeadingBlock from "./blocks/heading-block";
import ParagraphBlock from "./blocks/paragraph-block";
import ListBlock from "./blocks/list-block";
import CodeBlock from "./blocks/code-block";
import CheckboxBlock from "./blocks/checkbox-block";

interface EditorProps {
  noteId: number | null;
}

export default function Editor({ noteId }: EditorProps) {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [title, setTitle] = useState("");
  const [showSlashMenu, setShowSlashMenu] = useState(false);
  const [slashMenuPosition, setSlashMenuPosition] = useState({ x: 0, y: 0 });
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null);
  const [currentNoteId, setCurrentNoteId] = useState<number | null>(null);
  const editorRef = useRef<HTMLDivElement>(null);

  const { data: note, isLoading } = useQuery<Note>({
    queryKey: ["/api/notes", noteId],
    enabled: !!noteId,
  });

  const updateNoteMutation = useMutation({
    mutationFn: async (data: { title?: string; blocks?: Block[] }) => {
      if (!noteId) return;
      const response = await apiRequest("PATCH", `/api/notes/${noteId}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notes"] });
      queryClient.invalidateQueries({ queryKey: ["/api/notes", noteId] });
    },
  });

  // Load note content when noteId changes
  useEffect(() => {
    if (noteId !== currentNoteId) {
      setCurrentNoteId(noteId);
      
      if (noteId === null) {
        setTitle("");
        setBlocks([]);
      }
    }
  }, [noteId, currentNoteId]);

  // Load note data when it becomes available
  useEffect(() => {
    if (note && noteId === currentNoteId) {
      setTitle(note.title || "");
      setBlocks(Array.isArray(note.blocks) ? note.blocks as Block[] : []);
    }
  }, [note, noteId, currentNoteId]);

  // Auto-save with debouncing
  useAutoSave(() => {
    if (noteId && !updateNoteMutation.isPending) {
      const hasContent = title.trim() !== "" || blocks.some(b => b.content.trim() !== "");
      
      if (hasContent) {
        updateNoteMutation.mutate({ title, blocks });
      }
    }
  }, [title, blocks, noteId], 1500);

  const updateBlock = (blockId: string, updates: Partial<Block>) => {
    setBlocks(prev => prev.map(block => 
      block.id === blockId ? { ...block, ...updates } : block
    ));
  };

  const insertBlock = (type: Block['type'], afterBlockId?: string) => {
    const newBlock: Block = {
      id: generateId(),
      type,
      content: "",
    };

    if (afterBlockId) {
      const index = blocks.findIndex(b => b.id === afterBlockId);
      const newBlocks = [...blocks];
      newBlocks.splice(index + 1, 0, newBlock);
      setBlocks(newBlocks);
    } else {
      setBlocks(prev => [...prev, newBlock]);
    }

    setShowSlashMenu(false);
    
    // Focus the new block
    setTimeout(() => {
      const element = document.querySelector(`[data-block-id="${newBlock.id}"]`);
      if (element) {
        (element as HTMLElement).focus();
      }
    }, 50);
  };

  const convertBlock = (blockId: string, newType: Block['type']) => {
    setBlocks(prev => prev.map(block => 
      block.id === blockId ? { ...block, type: newType } : block
    ));
    setShowSlashMenu(false);
    
    // Focus the converted block
    setTimeout(() => {
      const element = document.querySelector(`[data-block-id="${blockId}"]`);
      if (element) {
        (element as HTMLElement).focus();
      }
    }, 50);
  };

  const deleteBlock = (blockId: string) => {
    setBlocks(prev => prev.filter(block => block.id !== blockId));
  };

  const handleKeyDown = (e: KeyboardEvent, blockId: string) => {
    const currentBlock = blocks.find(b => b.id === blockId);
    
    if (e.key === '/' && !showSlashMenu) {
      // Check if the cursor is at the beginning of the line or after a space
      const target = e.target as HTMLInputElement | HTMLTextAreaElement;
      const cursorPosition = target.selectionStart || 0;
      const textBeforeCursor = target.value.substring(0, cursorPosition);
      
      if (textBeforeCursor === '' || textBeforeCursor.endsWith(' ')) {
        e.preventDefault();
        const rect = target.getBoundingClientRect();
        setSlashMenuPosition({ x: rect.left, y: rect.bottom + 10 });
        setActiveBlockId(blockId);
        setShowSlashMenu(true);
      }
    } else if (e.key === 'Enter' && !e.shiftKey) {
      // Different behavior for different block types
      if (currentBlock?.type === 'bullet-list' || currentBlock?.type === 'numbered-list') {
        if (currentBlock.content.trim() === '') {
          // Exit list mode - convert to paragraph
          e.preventDefault();
          convertBlock(blockId, 'paragraph');
        } else {
          // Create new list item
          e.preventDefault();
          insertBlock(currentBlock.type, blockId);
        }
      } else if (currentBlock?.type === 'checkbox-list') {
        if (currentBlock.content.trim() === '') {
          // Exit checkbox mode - convert to paragraph
          e.preventDefault();
          convertBlock(blockId, 'paragraph');
        } else {
          // Create new checkbox item
          e.preventDefault();
          insertBlock('checkbox-list', blockId);
        }
      } else {
        // For paragraphs and headings, create new paragraph
        e.preventDefault();
        insertBlock('paragraph', blockId);
      }
    } else if (e.key === 'Backspace') {
      const block = blocks.find(b => b.id === blockId);
      if (block && block.content === '') {
        e.preventDefault();
        deleteBlock(blockId);
        
        // Focus previous block
        const currentIndex = blocks.findIndex(b => b.id === blockId);
        if (currentIndex > 0) {
          const prevBlock = blocks[currentIndex - 1];
          setTimeout(() => {
            const element = document.querySelector(`[data-block-id="${prevBlock.id}"]`);
            if (element) {
              (element as HTMLElement).focus();
            }
          }, 50);
        }
      }
    } else if (showSlashMenu && e.key === 'Escape') {
      setShowSlashMenu(false);
    }
  };

  const renderBlock = (block: Block) => {
    const commonProps = {
      block,
      onUpdate: updateBlock,
      onKeyDown: handleKeyDown,
    };

    switch (block.type) {
      case 'heading-1':
      case 'heading-2':
      case 'heading-3':
        return <HeadingBlock key={block.id} {...commonProps} />;
      case 'bullet-list':
      case 'numbered-list':
        return <ListBlock key={block.id} {...commonProps} blocks={blocks} />;
      case 'checkbox-list':
        return <CheckboxBlock key={block.id} {...commonProps} />;
      case 'code':
        return <CodeBlock key={block.id} {...commonProps} />;
      default:
        return <ParagraphBlock key={block.id} {...commonProps} />;
    }
  };

  if (!noteId) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <div className="text-2xl mb-2">📝</div>
          <p>Select a note to start editing</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-muted-foreground">Loading note...</div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col relative" ref={editorRef}>
      {/* Editor Header */}
      <div className="px-8 py-4 border-b border-border bg-background">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Input
              value={title || ""}
              onChange={(e) => setTitle(e.target.value)}
              className="text-2xl font-semibold bg-transparent border-none shadow-none p-0 h-auto focus-visible:ring-0"
              placeholder="Untitled"
            />
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span>Auto-saved</span>
            </div>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-8 py-6">
          <div className="space-y-4">
            {blocks.length === 0 ? (
              <div 
                className="text-muted-foreground cursor-text min-h-[24px] p-2"
                onClick={() => {
                  insertBlock('paragraph');
                }}
              >
                <span>Type </span>
                <span className="bg-muted px-1 rounded text-sm font-mono">/</span>
                <span> for commands</span>
              </div>
            ) : (
              blocks.map(renderBlock)
            )}
          </div>
        </div>
      </div>

      {/* Slash Menu */}
      {showSlashMenu && (
        <SlashMenu
          position={slashMenuPosition}
          onSelect={(type) => {
            if (activeBlockId) {
              const currentBlock = blocks.find(b => b.id === activeBlockId);
              if (currentBlock && currentBlock.content.trim() === "") {
                // Convert empty block to selected type
                convertBlock(activeBlockId, type);
              } else {
                // For non-empty blocks, convert the current block instead of inserting
                convertBlock(activeBlockId, type);
              }
            }
          }}
          onClose={() => setShowSlashMenu(false)}
        />
      )}
    </div>
  );
}
