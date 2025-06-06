import { useState } from "react";
import { useParams } from "wouter";
import Sidebar from "@/components/sidebar";
import Editor from "@/components/editor";

export default function EditorPage() {
  const { id } = useParams<{ id?: string }>();
  const [selectedNoteId, setSelectedNoteId] = useState<number | null>(
    id ? parseInt(id) : null
  );

  return (
    <div className="flex h-screen bg-background">
      <Sidebar 
        selectedNoteId={selectedNoteId}
        onNoteSelect={setSelectedNoteId}
      />
      <Editor noteId={selectedNoteId} />
    </div>
  );
}
