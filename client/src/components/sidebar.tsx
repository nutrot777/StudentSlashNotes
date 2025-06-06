import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Plus, Search, StickyNote } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Note } from "@shared/schema";
import { formatTimeAgo, getBlockPreview, countBlocks } from "@/lib/utils";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface SidebarProps {
  selectedNoteId: number | null;
  onNoteSelect: (id: number) => void;
}

export default function Sidebar({ selectedNoteId, onNoteSelect }: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const { data: notes = [], isLoading } = useQuery<Note[]>({
    queryKey: searchQuery ? ["/api/notes/search", searchQuery] : ["/api/notes"],
    queryFn: async () => {
      const url = searchQuery 
        ? `/api/notes/search?q=${encodeURIComponent(searchQuery)}`
        : "/api/notes";
      const response = await fetch(url, { credentials: "include" });
      if (!response.ok) throw new Error("Failed to fetch notes");
      return response.json();
    },
  });

  const createNoteMutation = useMutation({
    mutationFn: async () => {
      const newNote = {
        title: "Untitled Note",
        blocks: [
          {
            id: `block-${Date.now()}`,
            type: "paragraph" as const,
            content: "",
          }
        ],
      };
      
      const response = await apiRequest("POST", "/api/notes", newNote);
      return response.json();
    },
    onSuccess: (newNote: Note) => {
      queryClient.invalidateQueries({ queryKey: ["/api/notes"] });
      onNoteSelect(newNote.id);
      toast({
        title: "Note created",
        description: "New note has been created successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create new note.",
        variant: "destructive",
      });
    },
  });

  return (
    <div className="w-80 bg-muted border-r border-border flex flex-col">
      {/* Header */}
      <div className="p-5 border-b border-border">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <StickyNote className="w-4 h-4 text-primary-foreground" />
          </div>
          <h1 className="text-xl font-semibold text-secondary-foreground">StudyNotes</h1>
        </div>
        
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Notes List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-2">
          {isLoading ? (
            <div className="p-4 text-center text-muted-foreground">
              Loading notes...
            </div>
          ) : notes.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              {searchQuery ? "No notes found" : "No notes yet"}
            </div>
          ) : (
            notes.map((note) => (
              <Card
                key={note.id}
                className={`p-3 mb-2 cursor-pointer transition-all hover:shadow-md ${
                  selectedNoteId === note.id
                    ? "bg-background shadow-sm border-primary/20"
                    : "hover:bg-background/50"
                }`}
                onClick={() => onNoteSelect(note.id)}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium text-secondary-foreground truncate">
                    {note.title}
                  </h3>
                  <span className="text-xs text-muted-foreground ml-2 flex-shrink-0">
                    {formatTimeAgo(note.updatedAt)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                  {getBlockPreview(note.blocks as any[])}
                </p>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {countBlocks(note.blocks as any[])} blocks
                  </Badge>
                  {selectedNoteId === note.id && (
                    <div className="w-2 h-2 bg-green-500 rounded-full" title="Auto-saved" />
                  )}
                </div>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* New Note Button */}
      <div className="p-4 border-t border-border">
        <Button
          onClick={() => createNoteMutation.mutate()}
          disabled={createNoteMutation.isPending}
          className="w-full"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Note
        </Button>
      </div>
    </div>
  );
}
