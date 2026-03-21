# Blog Reader Page

## Route
`/blog/:id`

## What's on this page
A clean, Medium-style reading experience for a single blog post. Think of it like opening an article — no sidebars, no distractions, just the content.

## What it shows
- **Title** — big and bold at the top, like a newspaper headline
- **Summary** — a brief description under the title
- **Date** — when the blog was created
- **Content** — the full article rendered from markdown with proper typography
- **Tags** — Medium tags as colored chips
- **Keywords** — SEO keywords listed below
- **Meta Description** — the SEO description
- **Medium URL** — link to the published article (if published)

## Actions
- **Back to Dashboard** — link at the top to go back
- **Delete** — permanently remove this blog with a GitHub-style confirmation dialog

## Delete Confirmation
When you click delete, a modal pops up asking you to type the exact blog title to confirm. This prevents accidental deletions — you really have to mean it.

## Loading State
Shows a skeleton animation (pulsing gray lines) while the blog data is loading.
