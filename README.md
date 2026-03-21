# AI Blog Automation Studio — Frontend

An AI-powered blog generation and publishing dashboard. Generate blog posts from topics using CrewAI, preview them with rich metadata, and publish directly to Medium.

## Pages

| Route | Page | Description |
|-------|------|-------------|
| `/` | Dashboard | Main control center — generate blogs, view history, preview & publish |
| `/login` | Login | Email/password login form (visual only for now) |
| `/signup` | Signup | Account creation form with password confirmation |
| `/blog/:id` | Blog Reader | Full article reading experience with meta info & delete option |

## Features

- **AI Blog Generation** — Enter a topic and the AI pipeline writes a complete blog post
- **Blog History** — See all your generated blogs with status tracking
- **Medium Publishing** — Publish blogs directly to Medium with one click
- **Blog Reader** — Clean, Medium-style reading view with full content and metadata
- **Delete Confirmation** — GitHub-style confirmation dialog (type the blog title to confirm)
- **Responsive Design** — Works on desktop, tablet, and mobile
- **Animations** — Fade-in, slide-up, stagger effects throughout the app

## Tech Stack

- **React 19** — UI framework
- **Vite** — Build tool and dev server
- **React Router DOM** — Client-side routing
- **Axios** — HTTP client for API requests
- **Marked** — Markdown to HTML parser

## Getting Started

### Prerequisites
- Node.js 18+
- npm 9+

### Install Dependencies
```bash
npm install
```

### Set Up Environment
Create a `.env` file in the root:
```
VITE_API_BASE_URL=http://localhost:8000/api
VITE_API_TOKEN=your-api-token-here
```

### Run Development Server
```bash
npm run dev
```
The app will be available at `http://localhost:5173`.

### Build for Production
```bash
npm run build
```

## Project Structure

```
frontend/
├── docs/                    # Page documentation
│   ├── LoginPage.md
│   ├── SignupPage.md
│   ├── DashboardPage.md
│   ├── BlogReaderPage.md
│   └── BlogHistorySection.md
├── src/
│   ├── api/
│   │   └── client.js        # API functions (fetch, generate, publish, delete)
│   ├── components/
│   │   ├── BlogForm.jsx      # Topic input form
│   │   ├── BlogHistory.jsx   # List of generated blogs
│   │   ├── BlogPreview.jsx   # Blog preview with actions
│   │   ├── DeleteConfirmModal.jsx  # GitHub-style delete popup
│   │   ├── Navbar.jsx        # Top navigation bar
│   │   └── StatusBadge.jsx   # Colored status pill
│   ├── pages/
│   │   ├── BlogReaderPage.jsx  # Full blog reading page
│   │   ├── DashboardPage.jsx   # Main dashboard
│   │   ├── LoginPage.jsx       # Login form
│   │   └── SignupPage.jsx      # Signup form
│   ├── styles/
│   │   └── app.css           # All styles, animations, responsive rules
│   ├── App.jsx               # Root component with routing
│   └── main.jsx              # Entry point with BrowserRouter
├── index.html
├── package.json
├── vite.config.js
└── .env
```

## Design

The app uses a warm, earthy color palette:
- **Background** — Cream gradients with subtle green and amber glows
- **Cards** — Semi-transparent panels with glassmorphism effect
- **Accent** — Deep emerald green (`#0c7a5e`)
- **Text** — Dark brown (`#2e2419`)
- **Headings** — Serif fonts (Iowan Old Style / Georgia) for that editorial feel
- **Body** — Sans-serif fonts (Aptos / Segoe UI) for readability
