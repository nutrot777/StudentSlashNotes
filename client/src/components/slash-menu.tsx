import { useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import type { Block } from "@shared/schema";

interface SlashMenuProps {
  position: { x: number; y: number };
  onSelect: (type: Block['type']) => void;
  onClose: () => void;
}

const menuItems = [
  {
    category: "Basic Blocks",
    items: [
      {
        type: "heading-1" as const,
        icon: "H1",
        title: "Heading 1",
        description: "Top-level heading",
        shortcut: "⌘⌥1",
      },
      {
        type: "heading-2" as const,
        icon: "H2", 
        title: "Heading 2",
        description: "Key section heading",
        shortcut: "⌘⌥2",
      },
      {
        type: "heading-3" as const,
        icon: "H3",
        title: "Heading 3", 
        description: "Subsection heading",
        shortcut: "⌘⌥3",
      },
      {
        type: "paragraph" as const,
        icon: "¶",
        title: "Paragraph",
        description: "The body of your document",
        shortcut: "⌘⌥0",
      },
    ],
  },
  {
    category: "Lists",
    items: [
      {
        type: "bullet-list" as const,
        icon: "•",
        title: "Bullet List",
        description: "List with unordered items",
        shortcut: "⌘⇧8",
      },
      {
        type: "numbered-list" as const,
        icon: "1.",
        title: "Numbered List",
        description: "List with ordered items", 
        shortcut: "⌘⇧7",
      },
      {
        type: "checkbox-list" as const,
        icon: "☑",
        title: "Check List",
        description: "List with checkboxes",
        shortcut: "⌘⇧9",
      },
    ],
  },
  {
    category: "Advanced",
    items: [
      {
        type: "code" as const,
        icon: "</>",
        title: "Code Block",
        description: "Code block with syntax highlighting",
        shortcut: "⌘⌥C",
      },
    ],
  },
];

export default function SlashMenu({ position, onSelect, onClose }: SlashMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  return (
    <Card
      ref={menuRef}
      className="absolute z-50 w-80 shadow-2xl border bg-background"
      style={{
        left: position.x,
        top: position.y,
      }}
    >
      <div className="py-2">
        {menuItems.map((category, categoryIndex) => (
          <div key={category.category}>
            <div className="px-4 py-2 text-xs text-muted-foreground font-medium border-b border-border">
              {category.category.toUpperCase()}
            </div>
            {category.items.map((item) => (
              <div
                key={item.type}
                className="hover:bg-muted px-4 py-3 cursor-pointer flex items-center gap-3 transition-colors"
                onClick={() => onSelect(item.type)}
              >
                <div className="w-8 h-8 bg-muted rounded flex items-center justify-center">
                  <span className="text-sm font-medium">{item.icon}</span>
                </div>
                <div className="flex-1">
                  <div className="font-medium">{item.title}</div>
                  <div className="text-sm text-muted-foreground">{item.description}</div>
                </div>
                <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                  {item.shortcut}
                </div>
              </div>
            ))}
            {categoryIndex < menuItems.length - 1 && (
              <div className="mt-2" />
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}
