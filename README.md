# Notion-Inspired Note-Taking Application

A comprehensive, feature-rich note-taking application built with modern web technologies. This application provides a Notion-like experience with block-based editing, multimedia support, real-time collaboration features, and advanced document management capabilities.

## 🚀 Features

### Core Functionality
- **Advanced Block-Based Editor**: Modular content system with multiple block types
- **Real-Time Auto-Save**: Automatic content persistence with visual feedback
- **Intelligent Search**: Full-text search across all notes and content
- **PDF Export**: High-quality document export with formatting preservation
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

### Block Types Supported
- **Text Blocks**: 
  - Paragraphs with rich text formatting
  - Headers (H1, H2, H3) for document structure
- **List Blocks**:
  - Bullet lists for unordered content
  - Numbered lists for sequential items
  - Interactive checkboxes for task management
- **Code Blocks**: Syntax-highlighted code snippets
- **Media Blocks**:
  - Image uploads with drag-and-drop support
  - Video and audio file embedding
  - Base64 encoding for reliable storage

### User Experience
- **Slash Commands**: Type "/" to access quick insertion menu
- **Block Reordering**: Hover-based up/down controls for content organization
- **Smart Navigation**: Keyboard shortcuts and intuitive controls
- **Visual Feedback**: Loading states, progress indicators, and status updates
- **Error Handling**: Graceful degradation and user-friendly error messages

### Technical Features
- **Database Persistence**: PostgreSQL with optimized queries
- **Type Safety**: Full TypeScript implementation
- **Modern UI**: Tailwind CSS with custom component library
- **Performance Optimized**: Efficient rendering and state management

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe development with full IntelliSense
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn/ui** - High-quality component library
- **TanStack Query** - Powerful data synchronization
- **Wouter** - Lightweight routing solution
- **Framer Motion** - Smooth animations and transitions

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Fast, minimalist web framework
- **TypeScript** - Type safety across the entire stack
- **Drizzle ORM** - Type-safe database queries
- **PostgreSQL** - Robust relational database

### Additional Libraries
- **jsPDF** - Client-side PDF generation
- **html2canvas** - HTML to canvas conversion
- **Lucide React** - Beautiful, customizable icons
- **Zod** - Schema validation library
- **date-fns** - Modern date utility library

## 📁 Project Architecture

```
note-taking-app/
├── 📁 client/                    # Frontend application
│   ├── 📁 src/
│   │   ├── 📁 components/        # React components
│   │   │   ├── 📁 blocks/        # Block type components
│   │   │   │   ├── paragraph-block.tsx
│   │   │   │   ├── heading-block.tsx
│   │   │   │   ├── list-block.tsx
│   │   │   │   ├── checkbox-block.tsx
│   │   │   │   ├── code-block.tsx
│   │   │   │   ├── image-block.tsx
│   │   │   │   └── media-block.tsx
│   │   │   ├── 📁 ui/            # Reusable UI components
│   │   │   │   ├── button.tsx
│   │   │   │   ├── input.tsx
│   │   │   │   ├── dialog.tsx
│   │   │   │   └── ...
│   │   │   ├── editor.tsx        # Main editor component
│   │   │   ├── sidebar.tsx       # Notes navigation
│   │   │   ├── slash-menu.tsx    # Command palette
│   │   │   └── sortable-block.tsx # Drag & drop wrapper
│   │   ├── 📁 hooks/             # Custom React hooks
│   │   │   ├── use-auto-save.ts  # Auto-save functionality
│   │   │   ├── use-mobile.tsx    # Mobile detection
│   │   │   └── use-toast.ts      # Notification system
│   │   ├── 📁 lib/               # Utility functions
│   │   │   ├── queryClient.ts    # API client setup
│   │   │   └── utils.ts          # Helper functions
│   │   ├── 📁 pages/             # Page components
│   │   │   ├── editor.tsx        # Main editor page
│   │   │   └── not-found.tsx     # 404 page
│   │   ├── App.tsx               # Root component
│   │   ├── main.tsx              # Application entry point
│   │   └── index.css             # Global styles
│   └── index.html                # HTML template
├── 📁 server/                    # Backend application
│   ├── index.ts                  # Server entry point
│   ├── routes.ts                 # API route definitions
│   ├── storage.ts                # Database operations
│   ├── db.ts                     # Database connection
│   └── vite.ts                   # Vite integration
├── 📁 shared/                    # Shared type definitions
│   └── schema.ts                 # Database schema & types
├── 📄 schema.sql                 # Database schema file
├── 📄 sample_data.sql            # Sample data for testing
├── 📄 package.json               # Dependencies & scripts
├── 📄 tsconfig.json              # TypeScript configuration
├── 📄 tailwind.config.ts         # Tailwind CSS configuration
├── 📄 vite.config.ts             # Vite configuration
├── 📄 drizzle.config.ts          # Drizzle ORM configuration
└── 📄 README.md                  # This file
```

## 🚀 Local Development Setup

### Prerequisites

Ensure you have the following installed on your system:

- **Node.js** (v18.0.0 or higher) - [Download here](https://nodejs.org/)
- **PostgreSQL** (v13.0 or higher) - [Download here](https://www.postgresql.org/download/)
- **npm** or **yarn** package manager (comes with Node.js)
- **Git** for version control

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd note-taking-app
```

### Step 2: Database Setup

#### Option A: Manual Database Setup

1. **Start PostgreSQL service** (method varies by OS):
   ```bash
   # macOS with Homebrew
   brew services start postgresql
   
   # Ubuntu/Debian
   sudo systemctl start postgresql
   
   # Windows
   # Start PostgreSQL service through Services panel
   ```

2. **Create the database:**
   ```bash
   # Connect to PostgreSQL as superuser
   psql -U postgres
   
   # Create database
   CREATE DATABASE note_app;
   
   # Create user (optional but recommended)
   CREATE USER note_app_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE note_app TO note_app_user;
   
   # Exit psql
   \q
   ```

3. **Run the schema setup:**
   ```bash
   psql -U note_app_user -d note_app -f schema.sql
   ```

4. **Load sample data (optional):**
   ```bash
   psql -U note_app_user -d note_app -f sample_data.sql
   ```

#### Option B: Using Drizzle Push (Alternative)

If you prefer using the ORM to manage schema:

```bash
npm install
npm run db:push
```

### Step 3: Environment Configuration

Create a `.env` file in the root directory:

```env
# Database Configuration
DATABASE_URL=postgresql://note_app_user:your_password@localhost:5432/note_app

# Alternative format for individual components
PGUSER=note_app_user
PGPASSWORD=your_password
PGHOST=localhost
PGPORT=5432
PGDATABASE=note_app

# Application Configuration
NODE_ENV=development
PORT=5000

# Optional: Enable debug logging
DEBUG=express:*
```

### Step 4: Install Dependencies

```bash
npm install
```

This will install all required dependencies for both frontend and backend.

### Step 5: Start the Development Server

```bash
npm run dev
```

This command will:
- Start the Express backend server on port 5000
- Start the Vite frontend development server
- Enable hot module replacement for instant updates
- Automatically open your browser to the application

### Step 6: Access the Application

Open your browser and navigate to:
```
http://localhost:5000
```

You should see the note-taking application with a sidebar for navigation and the main editor area.

## 📋 Available Scripts

The project includes several npm scripts for development and maintenance:

```bash
# Development
npm run dev          # Start development server with hot reload
npm run build        # Build production version
npm run preview      # Preview production build locally

# Database Management
npm run db:push      # Push schema changes to database
npm run db:studio    # Open Drizzle Studio (database GUI)
npm run db:generate  # Generate migration files

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler check
```

## 🔌 API Reference

### Notes Endpoints

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| `GET` | `/api/notes` | Retrieve all notes | - | Array of notes |
| `GET` | `/api/notes/:id` | Get specific note | - | Single note object |
| `POST` | `/api/notes` | Create new note | `{title, blocks}` | Created note |
| `PATCH` | `/api/notes/:id` | Update note | `{title?, blocks?}` | Updated note |
| `DELETE` | `/api/notes/:id` | Delete note | - | Success message |
| `GET` | `/api/notes/search?q=query` | Search notes | - | Matching notes |

### Data Models

#### Note Object
```typescript
{
  id: number;
  title: string;
  blocks: Block[];
  createdAt: string;
  updatedAt: string;
}
```

#### Block Object
```typescript
{
  id: string;
  type: 'paragraph' | 'heading-1' | 'heading-2' | 'heading-3' | 
        'bullet-list' | 'numbered-list' | 'checkbox-list' | 
        'code' | 'image' | 'video' | 'audio';
  content: string;
  metadata?: Record<string, any>;
}
```

## 📖 User Guide

### Getting Started

1. **Create Your First Note**: Click the "+" button in the sidebar to create a new note
2. **Add a Title**: Click on "Untitled" at the top to name your note
3. **Start Writing**: Click in the content area and begin typing
4. **Use Slash Commands**: Type "/" to see available block types

### Working with Blocks

#### Text Blocks
- **Paragraph**: Default text block for regular content
- **Headings**: Use H1, H2, H3 for document structure
  - Type `/h1`, `/h2`, or `/h3` to insert headings

#### Lists and Tasks
- **Bullet Lists**: Type `/bullet` or `-` followed by space
- **Numbered Lists**: Type `/numbered` or `1.` followed by space  
- **Checkboxes**: Type `/checkbox` or `[]` for task management
  - Click checkboxes to mark tasks as complete

#### Code and Media
- **Code Blocks**: Type `/code` for syntax-highlighted code snippets
- **Images**: Type `/image` to upload and display images
  - Supports drag-and-drop file upload
  - Automatically adds new paragraph after upload
- **Media**: Type `/video` or `/audio` for multimedia content

#### Block Management
- **Reordering**: Hover over any block to see up/down arrow controls
- **Auto-continuation**: Press Enter in lists to create new items
- **Exit Lists**: Press Enter on empty list item to convert to paragraph
- **Cancel Uploads**: Use the cancel button if you change your mind about uploads

### Advanced Features

#### PDF Export
1. Complete your note with all desired content
2. Click "Download PDF" in the header
3. PDF preserves all formatting, images, and structure

#### Search Functionality
- Use the search bar in the sidebar
- Searches through all note titles and content
- Real-time results as you type

#### Auto-Save
- All changes are automatically saved
- Green indicator shows "Auto-saved" status
- No need to manually save your work

## 🛠️ Development Guide

### Architecture Overview

The application follows a modern full-stack architecture:

#### Frontend Architecture
- **Component-Based**: Modular React components for each block type
- **State Management**: TanStack Query for server state, React hooks for local state
- **Type Safety**: Full TypeScript implementation with strict typing
- **Styling**: Tailwind CSS with component composition patterns

#### Backend Architecture
- **RESTful API**: Express.js with clear endpoint structure
- **Database Layer**: Drizzle ORM for type-safe database operations
- **Data Validation**: Zod schemas for request/response validation
- **Error Handling**: Comprehensive error handling with proper HTTP status codes

### Adding New Features

#### Creating a New Block Type

1. **Define the type** in `shared/schema.ts`:
```typescript
// Add to the block type enum
type: z.enum([
  // ... existing types
  'your-new-block'
])
```

2. **Create the component** in `client/src/components/blocks/`:
```typescript
// your-new-block.tsx
interface YourNewBlockProps {
  block: Block;
  onUpdate: (blockId: string, updates: Partial<Block>) => void;
  onKeyDown: (e: KeyboardEvent, blockId: string) => void;
}

export default function YourNewBlock({ block, onUpdate, onKeyDown }: YourNewBlockProps) {
  // Component implementation
}
```

3. **Add to the renderer** in `client/src/components/editor.tsx`:
```typescript
case 'your-new-block':
  return <YourNewBlock key={block.id} {...commonProps} />;
```

4. **Include in slash menu** in `client/src/components/slash-menu.tsx`:
```typescript
{
  label: 'Your New Block',
  type: 'your-new-block',
  icon: YourIcon,
  description: 'Description of your block'
}
```

### Database Schema Changes

1. **Update schema** in `shared/schema.ts`
2. **Generate migration**:
   ```bash
   npm run db:generate
   ```
3. **Apply changes**:
   ```bash
   npm run db:push
   ```

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Yes | - |
| `NODE_ENV` | Environment mode | No | `development` |
| `PORT` | Server port | No | `5000` |
| `PGUSER` | Database user | No | - |
| `PGPASSWORD` | Database password | No | - |
| `PGHOST` | Database host | No | `localhost` |
| `PGPORT` | Database port | No | `5432` |
| `PGDATABASE` | Database name | No | - |

## 🐛 Troubleshooting

### Common Issues

#### Database Connection Issues
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```
**Solution**: Ensure PostgreSQL is running and connection details are correct

#### Port Already in Use
```
Error: listen EADDRINUSE :::5000
```
**Solution**: Change PORT in `.env` or stop the process using port 5000

#### TypeScript Errors
```
Property 'xyz' does not exist on type...
```
**Solution**: Check type definitions in `shared/schema.ts` and ensure imports are correct

#### File Upload Issues
```
PayloadTooLargeError: request entity too large
```
**Solution**: Large media files may exceed server limits. Consider file compression or CDN storage

### Performance Optimization

#### Database Performance
- Indexes are automatically created for search functionality
- Use database queries instead of client-side filtering
- Consider pagination for large note collections

#### Frontend Performance
- Components use React.memo() where appropriate
- Images are base64 encoded for simplicity but consider CDN for production
- Auto-save is debounced to prevent excessive API calls

## 🚀 Deployment

### Production Considerations

1. **Environment Variables**: Set production DATABASE_URL
2. **Build Optimization**: Run `npm run build` for optimized assets
3. **Database**: Ensure PostgreSQL is configured for production load
4. **File Storage**: Consider external storage for media files in production
5. **Security**: Implement authentication and authorization as needed

### Recommended Hosting

- **Frontend**: Vercel, Netlify, or similar static hosting
- **Backend**: Railway, Render, or traditional VPS
- **Database**: PostgreSQL on Railway, Supabase, or managed PostgreSQL

## 📝 License

This project is licensed under the MIT License. See the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript strict mode conventions
- Use meaningful component and variable names
- Write comprehensive JSDoc comments for complex functions
- Test new features thoroughly across different browsers
- Ensure responsive design works on mobile devices

## 📞 Support

For questions, issues, or contributions:

1. Check existing GitHub issues
2. Create a new issue with detailed description
3. Include steps to reproduce any bugs
4. Provide environment details (OS, Node version, etc.)

---

Built with ❤️ using modern web technologies