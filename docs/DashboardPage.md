# Dashboard Page

## Route
`/` (home page)

## What's on this page
The main control center for the app. This is where you generate new blogs and manage existing ones.

## Layout
Two-column layout:

### Left Column
1. **Blog Form** — enter a topic and click "Generate Blog" to create a new AI-written post
2. **Blog History** — list of all generated blogs with their status, date, and a "Read" link

### Right Column
- **Blog Preview** — shows the selected blog's title, summary, content, meta description, tags, keywords, and Medium URL
- **Publish button** — push the blog to Medium
- **Delete button** — permanently remove a blog (asks for confirmation first)
- **Read Full Blog** — opens the dedicated reader page

## How it works
1. Type a topic in the form
2. Click "Generate Blog" — the AI pipeline writes the full article
3. The new blog appears in the history list and is auto-selected for preview
4. From the preview, you can publish to Medium, read the full blog, or delete it
