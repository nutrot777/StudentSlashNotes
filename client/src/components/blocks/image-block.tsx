import { useState, useRef } from "react";
import { GripVertical, Upload, Image as ImageIcon, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Block } from "@shared/schema";

interface ImageBlockProps {
  block: Block;
  onUpdate: (blockId: string, updates: Partial<Block>) => void;
  onKeyDown: (e: KeyboardEvent, blockId: string) => void;
}

export default function ImageBlock({ block, onUpdate, onKeyDown }: ImageBlockProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    setIsUploading(true);
    
    try {
      // Convert to base64 for storage
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        onUpdate(block.id, { 
          content: base64,
          metadata: {
            fileName: file.name,
            fileSize: file.size,
            fileType: file.type
          }
        });
        setIsUploading(false);
        
        // Auto-add a new paragraph block after the image
        setTimeout(() => {
          const newBlock = {
            id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            type: 'paragraph' as const,
            content: '',
            metadata: {}
          };
          
          // Trigger adding new block by simulating Enter key
          const event = new KeyboardEvent('keydown', { key: 'Enter' });
          onKeyDown(event, block.id);
        }, 100);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Upload failed:', error);
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const removeImage = () => {
    onUpdate(block.id, { content: "", metadata: {} });
  };

  const cancelUpload = () => {
    // Convert to paragraph block if no content
    onUpdate(block.id, { type: 'paragraph', content: "" });
  };

  return (
    <div className="group relative block-hover" data-block-type={block.type}>
      <div className="absolute -left-6 top-1 drag-handle">
        <button className="w-4 h-4 text-muted-foreground hover:text-foreground" title="Drag to reorder">
          <GripVertical className="w-3 h-3" />
        </button>
      </div>

      {block.content ? (
        <div className="relative">
          <img 
            src={block.content} 
            alt={block.metadata?.fileName || "Uploaded image"}
            className="max-w-full h-auto rounded-lg border border-border"
            style={{ maxHeight: '400px' }}
          />
          <Button
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={removeImage}
          >
            <X className="w-4 h-4" />
          </Button>
          {block.metadata?.fileName && (
            <p className="text-sm text-muted-foreground mt-2">
              {block.metadata.fileName}
            </p>
          )}
        </div>
      ) : (
        <div
          className="border-2 border-dashed border-muted-foreground/30 rounded-lg p-8 text-center hover:border-muted-foreground/50 transition-colors"
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          
          {isUploading ? (
            <div className="flex flex-col items-center gap-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="text-sm text-muted-foreground">Uploading...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <ImageIcon className="w-12 h-12 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  Drag and drop an image here, or
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Choose Image
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={cancelUpload}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}