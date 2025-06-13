import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { MoreHorizontal, GripVertical, ChevronUp, ChevronDown, Download } from "lucide-react";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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
import ImageBlock from "./blocks/image-block";
import MediaBlock from "./blocks/media-block";

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

  // Simple block reordering functions
  const moveBlockUp = (blockId: string) => {
    const index = blocks.findIndex(b => b.id === blockId);
    if (index > 0) {
      const newBlocks = [...blocks];
      [newBlocks[index - 1], newBlocks[index]] = [newBlocks[index], newBlocks[index - 1]];
      setBlocks(newBlocks);
    }
  };

  const moveBlockDown = (blockId: string) => {
    const index = blocks.findIndex(b => b.id === blockId);
    if (index < blocks.length - 1) {
      const newBlocks = [...blocks];
      [newBlocks[index], newBlocks[index + 1]] = [newBlocks[index + 1], newBlocks[index]];
      setBlocks(newBlocks);
    }
  };



  const { data: note, isLoading } = useQuery<Note>({
    queryKey: ["/api/notes", noteId],
    queryFn: async () => {
      const response = await fetch(`/api/notes/${noteId}`);
      if (!response.ok) throw new Error("Failed to fetch note");
      return response.json();
    },
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
      const noteBlocks = Array.isArray(note.blocks) ? note.blocks as Block[] : [];
      setBlocks(noteBlocks);
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

  // PDF download functionality
  const downloadAsPDF = async () => {
    if (!note || !title) return;
    
    try {
      // Create a temporary container with the note content
      const tempDiv = document.createElement('div');
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.top = '0';
      tempDiv.style.width = '800px';
      tempDiv.style.padding = '40px';
      tempDiv.style.backgroundColor = 'white';
      tempDiv.style.fontFamily = 'Arial, sans-serif';
      tempDiv.style.fontSize = '14px';
      tempDiv.style.lineHeight = '1.6';
      
      // Add title
      const titleElement = document.createElement('h1');
      titleElement.textContent = title;
      titleElement.style.fontSize = '24px';
      titleElement.style.marginBottom = '20px';
      titleElement.style.color = '#000';
      tempDiv.appendChild(titleElement);
      
      // Add blocks content
      blocks.forEach(block => {
        const blockElement = document.createElement('div');
        blockElement.style.marginBottom = '15px';
        
        switch (block.type) {
          case 'heading-1':
            blockElement.innerHTML = `<h1 style="font-size: 20px; margin: 0; color: #000;">${block.content}</h1>`;
            break;
          case 'heading-2':
            blockElement.innerHTML = `<h2 style="font-size: 18px; margin: 0; color: #000;">${block.content}</h2>`;
            break;
          case 'heading-3':
            blockElement.innerHTML = `<h3 style="font-size: 16px; margin: 0; color: #000;">${block.content}</h3>`;
            break;
          case 'bullet-list':
            blockElement.innerHTML = `<p style="margin: 0; color: #000;">• ${block.content}</p>`;
            break;
          case 'numbered-list':
            blockElement.innerHTML = `<p style="margin: 0; color: #000;">1. ${block.content}</p>`;
            break;
          case 'checkbox-list':
            const checked = block.metadata?.checked ? '☑' : '☐';
            blockElement.innerHTML = `<p style="margin: 0; color: #000;">${checked} ${block.content}</p>`;
            break;
          case 'code':
            blockElement.innerHTML = `<pre style="background: #f5f5f5; padding: 10px; border-radius: 4px; font-family: monospace; margin: 0; color: #000;">${block.content}</pre>`;
            break;
          case 'image':
            if (block.content) {
              blockElement.innerHTML = `<img src="${block.content}" style="max-width: 100%; height: auto; margin: 10px 0;" />`;
            }
            break;
          default:
            blockElement.innerHTML = `<p style="margin: 0; color: #000;">${block.content}</p>`;
        }
        
        tempDiv.appendChild(blockElement);
      });
      
      document.body.appendChild(tempDiv);
      
      // Generate canvas from the content
      const canvas = await html2canvas(tempDiv, {
        backgroundColor: 'white',
        scale: 2,
        useCORS: true,
        allowTaint: true
      });
      
      // Remove temporary element
      document.body.removeChild(tempDiv);
      
      // Create PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgData = canvas.toDataURL('image/png');
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 0;
      
      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      
      // Download the PDF
      pdf.save(`${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`);
      
    } catch (error) {
      console.error('PDF generation failed:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  // Function to add a paragraph block after media upload
  const addParagraphAfterBlock = (afterBlockId: string) => {
    const newBlock: Block = {
      id: generateId(),
      type: 'paragraph',
      content: "",
      metadata: {}
    };

    const index = blocks.findIndex(b => b.id === afterBlockId);
    if (index !== -1) {
      setBlocks(prev => {
        const newBlocks = [...prev];
        newBlocks.splice(index + 1, 0, newBlock);
        return newBlocks;
      });

      // Focus the new block
      setTimeout(() => {
        const element = document.querySelector(`[data-block-id="${newBlock.id}"]`);
        if (element) {
          (element as HTMLElement).focus();
        }
      }, 200);
    }
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
      onAddParagraph: addParagraphAfterBlock,
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
      case 'image':
        return <ImageBlock key={block.id} {...commonProps} />;
      case 'video':
      case 'audio':
        return <MediaBlock key={block.id} {...commonProps} />;
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
            <Button 
              variant="outline" 
              size="sm"
              onClick={downloadAsPDF}
              disabled={!title || blocks.length === 0}
            >
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
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
              blocks.map((block, index) => (
                <div key={block.id} className="relative group">
                  <div className="absolute -left-12 top-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {index > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => moveBlockUp(block.id)}
                        title="Move up"
                      >
                        <ChevronUp className="w-3 h-3" />
                      </Button>
                    )}
                    {index < blocks.length - 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => moveBlockDown(block.id)}
                        title="Move down"
                      >
                        <ChevronDown className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                  {renderBlock(block)}
                </div>
              ))
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
