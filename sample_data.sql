-- Sample data dump for note-taking application
-- Run this after setting up the schema.sql

-- Insert sample notes with various block types
INSERT INTO notes (title, blocks, created_at, updated_at) VALUES 
(
    'Getting Started with Notes',
    '[
        {
            "id": "block-sample-1",
            "type": "heading-1",
            "content": "Welcome to Your Note-Taking App",
            "metadata": {}
        },
        {
            "id": "block-sample-2", 
            "type": "paragraph",
            "content": "This is a sample note to demonstrate the various block types available.",
            "metadata": {}
        },
        {
            "id": "block-sample-3",
            "type": "heading-2", 
            "content": "Features",
            "metadata": {}
        },
        {
            "id": "block-sample-4",
            "type": "bullet-list",
            "content": "Rich text editing with various block types",
            "metadata": {}
        },
        {
            "id": "block-sample-5",
            "type": "bullet-list", 
            "content": "Drag and drop block reordering",
            "metadata": {}
        },
        {
            "id": "block-sample-6",
            "type": "bullet-list",
            "content": "PDF export functionality", 
            "metadata": {}
        },
        {
            "id": "block-sample-7",
            "type": "bullet-list",
            "content": "Auto-save functionality",
            "metadata": {}
        }
    ]'::jsonb,
    NOW(),
    NOW()
),
(
    'Code Examples',
    '[
        {
            "id": "block-code-1",
            "type": "heading-1", 
            "content": "Code Snippets",
            "metadata": {}
        },
        {
            "id": "block-code-2",
            "type": "paragraph",
            "content": "Here are some useful code examples:",
            "metadata": {}
        },
        {
            "id": "block-code-3",
            "type": "code",
            "content": "function hello() {\n    console.log(\"Hello, World!\");\n}",
            "metadata": {}
        },
        {
            "id": "block-code-4",
            "type": "paragraph", 
            "content": "JavaScript function example above.",
            "metadata": {}
        }
    ]'::jsonb,
    NOW(),
    NOW()
),
(
    'Task List Example',
    '[
        {
            "id": "block-task-1",
            "type": "heading-1",
            "content": "My Tasks",
            "metadata": {}
        },
        {
            "id": "block-task-2",
            "type": "checkbox-list",
            "content": "Complete the project documentation",
            "metadata": {"checked": true}
        },
        {
            "id": "block-task-3", 
            "type": "checkbox-list",
            "content": "Review code changes",
            "metadata": {"checked": false}
        },
        {
            "id": "block-task-4",
            "type": "checkbox-list", 
            "content": "Deploy to production",
            "metadata": {"checked": false}
        },
        {
            "id": "block-task-5",
            "type": "numbered-list",
            "content": "First priority item",
            "metadata": {}
        },
        {
            "id": "block-task-6",
            "type": "numbered-list",
            "content": "Second priority item", 
            "metadata": {}
        }
    ]'::jsonb,
    NOW(),
    NOW()
);

-- Update the sequence to ensure proper ID generation
SELECT setval('notes_id_seq', (SELECT MAX(id) FROM notes));