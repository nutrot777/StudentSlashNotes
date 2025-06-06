import { useState, useRef } from "react";
import { GripVertical, Upload, Video, Music, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Block } from "@shared/schema";

interface MediaBlockProps {
  block: Block;
  onUpdate: (blockId: string, updates: Partial<Block>) => void;
  onKeyDown: (e: KeyboardEvent, blockId: string) => void;
  onAddParagraph?: (afterBlockId: string) => void;
}

export default function MediaBlock({ block, onUpdate, onKeyDown, onAddParagraph }: MediaBlockProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isVideo = block.type === 'video';
  const isAudio = block.type === 'audio';
  
  const acceptedTypes = isVideo ? 'video/*' : 'audio/*';
  const mediaTypes = isVideo ? ['video/'] : ['audio/'];

  const handleFileUpload = async (file: File) => {
    const isValidType = mediaTypes.some(type => file.type.startsWith(type));
    if (!isValidType) {
      alert(`Please select a ${isVideo ? 'video' : 'audio'} file`);
      return;
    }

    setIsUploading(true);
    
    try {
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
        
        // Auto-add a new paragraph block after the media
        setTimeout(() => {
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

  const removeMedia = () => {
    onUpdate(block.id, { content: "", metadata: {} });
  };

  const cancelUpload = () => {
    // Convert to paragraph block if no content
    onUpdate(block.id, { type: 'paragraph', content: "" });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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
          {isVideo ? (
            <video 
              controls
              className="max-w-full h-auto rounded-lg border border-border"
              style={{ maxHeight: '400px' }}
            >
              <source src={block.content} type={block.metadata?.fileType} />
              Your browser does not support the video element.
            </video>
          ) : (
            <audio 
              controls
              className="w-full"
            >
              <source src={block.content} type={block.metadata?.fileType} />
              Your browser does not support the audio element.
            </audio>
          )}
          
          <Button
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={removeMedia}
          >
            <X className="w-4 h-4" />
          </Button>
          
          {block.metadata?.fileName && (
            <div className="mt-2 text-sm text-muted-foreground">
              <p>{block.metadata.fileName}</p>
              {block.metadata.fileSize && (
                <p>{formatFileSize(block.metadata.fileSize)}</p>
              )}
            </div>
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
            accept={acceptedTypes}
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
              {isVideo ? (
                <Video className="w-12 h-12 text-muted-foreground" />
              ) : (
                <Music className="w-12 h-12 text-muted-foreground" />
              )}
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  Drag and drop a {isVideo ? 'video' : 'audio'} file here, or
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Choose {isVideo ? 'Video' : 'Audio'}
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