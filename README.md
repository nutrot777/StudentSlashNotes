# Note-Taking Application

A powerful Notion-inspired note-taking application with advanced block-based editing, multimedia support, and PDF export functionality.

## Features

- **Block-based editing system** with support for:
  - Paragraphs
  - Headings (H1, H2, H3)
  - Bullet lists and numbered lists
  - Checkboxes with task management
  - Code blocks with syntax highlighting
  - Image uploads with drag & drop
  - Video and audio file support

- **Interactive editing**:
  - Slash commands (/) for quick block insertion
  - Block reordering with up/down arrows
  - Real-time auto-save functionality
  - Cancel options for media uploads

- **Export functionality**:
  - PDF download with proper formatting
  - Preserves all content types including images

- **Modern tech stack**:
  - React frontend with TypeScript
  - Express backend
  - PostgreSQL database with Drizzle ORM
  - Responsive design with Tailwind CSS

## Local Development Setup

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v13 or higher)
- npm or yarn package manager

### Database Setup

1. **Create PostgreSQL database:**
   ```sql
   CREATE DATABASE note_app;
   ```

2. **Run the schema setup:**
   ```bash
   psql -d note_app -f schema.sql
   ```

3. **Optional - Load sample data:**
   ```bash
   psql -d note_app -f sample_data.sql
   ```

### Environment Configuration

Create a `.env` file in the root directory:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/note_app
NODE_ENV=development
PORT=5000
```

Replace `username` and `password` with your PostgreSQL credentials.

### Installation and Running

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Push database schema (alternative to manual setup):**
   ```bash
   npm run db:push
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Access the application:**
   Open your browser to `http://localhost:5000`

## Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── blocks/     # Block type components
│   │   │   └── ui/         # UI components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utility functions
│   │   └── pages/          # Page components
│   └── index.html
├── server/                 # Express backend
│   ├── index.ts           # Server entry point
│   ├── routes.ts          # API routes
│   ├── storage.ts         # Database operations
│   └── db.ts              # Database connection
├── shared/                 # Shared types and schemas
│   └── schema.ts          # Drizzle schema definitions
├── schema.sql             # Database schema for local setup
├── sample_data.sql        # Sample data for testing
└── package.json
```

## API Endpoints

- `GET /api/notes` - Retrieve all notes
- `GET /api/notes/:id` - Get specific note
- `POST /api/notes` - Create new note
- `PATCH /api/notes/:id` - Update note
- `DELETE /api/notes/:id` - Delete note
- `GET /api/notes/search?q=query` - Search notes

## Usage

### Creating Notes

1. Click on a note in the sidebar or create a new one
2. Use the title field to name your note
3. Type `/` to open the command menu and select block types
4. Content is automatically saved as you type

### Block Types

- **Paragraph** - Regular text content
- **Headings** - H1, H2, H3 for document structure
- **Lists** - Bullet points and numbered lists
- **Checkboxes** - Task management with completion tracking
- **Code** - Code snippets with monospace formatting
- **Images** - Upload and display images
- **Media** - Video and audio file support

### Block Management

- **Reordering**: Hover over blocks to see up/down arrows
- **Slash commands**: Type `/` to insert new blocks
- **Auto-continuation**: Lists automatically continue on Enter
- **Block conversion**: Exit list mode with empty Enter

### Export

Click the "Download PDF" button in the editor header to export your note as a formatted PDF document.

## Development

### Database Migrations

When making schema changes:

1. Update `shared/schema.ts`
2. Run `npm run db:push` to apply changes

### Adding New Block Types

1. Create component in `client/src/components/blocks/`
2. Add type to schema in `shared/schema.ts`
3. Update the block renderer in `client/src/components/editor.tsx`
4. Add to slash menu in `client/src/components/slash-menu.tsx`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.