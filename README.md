# lahavpadan.github.io

A GitHub Pages starter for a technical blog: readable, equation-friendly writing for mathematical topics; a more spare, monospace-first treatment for cyber posts.

## What changed in this version

- The exact header path is `~/lahavpadan.github.io/`, without a cursor or injected symbol.
- Search and tag filters are rendered directly by Jekyll, then handled by a small no-dependency script.
- CSS and JavaScript URLs include a build-time version query so a deployed redesign does not remain stuck behind an old browser cache.
- No estimated reading times.
- Each post is labelled `brief` or `comprehensive` through its front matter.
- Any post tagged `cyber` automatically uses the cyber article layout; all other posts use the mathematical-notebook layout.
- `/whoami/` contains your rewritten introduction, photo frame, areas of focus, and a short reading list.
- `_data/whoami.yml` is the one place to edit the areas and recommended blogs.
- The footer reads: `Lahav Padan · looking into the internals`.

## 1. Publish with GitHub Pages

Create a **public** GitHub repository named exactly:

```text
lahavpadan.github.io
```

Upload or push the files in this folder. Then open:

```text
Repository → Settings → Pages → Build and deployment → Source → GitHub Actions
```

The included workflow in `.github/workflows/pages.yml` builds and deploys the site after every push to `main`.

## 2. Add a post: the Obsidian-style workflow

Each post is a self-contained folder:

```text
posts/
  my-new-topic/
    index.md
    diagram.svg
    result.png
```

Copy `templates/post-template.md` into `posts/my-new-topic/index.md`, then edit its front matter.

```yaml
---
layout: post
title: "A precise title"
description: "A one- or two-sentence summary."
date: 2026-07-07
tags:
  - machine learning
entry_type: comprehensive # Either `brief` or `comprehensive`.
math: true
---
```

Use normal Obsidian-compatible Markdown below that block. Keep images in the same folder and reference them normally:

```md
![A useful diagram](diagram.svg)
```

## 3. How tags work

Tags are determined by the `tags:` list in the front matter of every post’s `index.md`.

```yaml
tags:
  - cyber
  - cryptography
```

When GitHub Pages builds the site, the home page receives those tags. The browser then gathers the unique tags from every rendered post card and creates the filter buttons automatically. There is no separate tag database to keep in sync.

The named tags below already have colours in `assets/css/main.css`:

```text
machine learning
cyber
cryptography
physics
electrical engineering
mathematics
```

A new tag still appears and filters correctly, but uses the neutral tag style until you add its colour class. Add a new rule near the comment `Add colour classes here`, for example:

```css
.tag--signal-processing {
  color: #1c62a8;
  border-color: #a9cbed;
  background: #edf6fe;
}
```

## 4. Cyber layout versus mathematical-notebook layout

The distinction is made automatically by tags:

```yaml
tags:
  - cyber
```

A cyber post gets a more spare, monospace-first article page with divider-led headings. Every post without `cyber` gets the readable serif layout for long explanations and mathematics.

A post can have several tags. As long as `cyber` is one of them, it receives the cyber layout.

## 5. Brief versus comprehensive posts

Instead of estimated reading time, use:

```yaml
entry_type: brief
```

or:

```yaml
entry_type: comprehensive
```

These labels appear on the home-page card and on the post page. They are a description of the post’s intended depth, not a calculated promise about how long someone takes to read.

## 6. Edit `whoami`

- **Writing and layout:** `whoami.md`
- **Photo:** place an image at `assets/images/whoami/profile.jpg`, then change `profile_image` in `_config.yml` to that path.
- **Areas of focus and recommended blogs:** `_data/whoami.yml`

The photo frame applies a shared monochrome treatment in CSS, so use a natural, well-lit head-and-shoulders photo and let the page supply the technical frame.

## 7. Main files

```text
.github/workflows/pages.yml  # GitHub Pages deployment
_config.yml                  # URL, title, profile photo location
_data/whoami.yml             # Focus areas and blogs you recommend
_includes/header.html        # Header links and theme switch
_layouts/default.html        # Shared page shell and footer
_layouts/post.html           # Automatic normal/cyber article layout
assets/css/main.css          # All visual styling and tag colours
assets/js/site.js            # Theme switch, search, automatic tag filters
index.html                   # Home page
whoami.md                    # About page
posts/                       # One folder per blog entry
templates/post-template.md   # Copy this for a new entry
```

## 8. Push changes

From the repository folder in Git Bash:

```bash
git add .
git commit -m "Add a new post"
git push
```

GitHub Actions publishes the update automatically.

## Visual structure

- The home page uses a compact terminal-style header, a clear personal introduction, and a dated post archive.
- `~/lahavpadan.github.io/` in the navigation is one exact text string: there is deliberately no blinking cursor or inserted character.
- The `◐` button is a plain light/dark toggle. It stores your choice in the browser.
- Posts whose `tags:` include `cyber` automatically use the cyber article layout.
