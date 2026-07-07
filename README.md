# lahavpadan.github.io

A GitHub Pages starter for a technical blog that combines a **calm mathematical notebook** with a **restrained cyber / terminal layer**.

- Light and dark theme button
- `posts` and `whoami` navigation in the upper-right
- Search directly on the home page (`/` focuses it)
- Clickable, coloured tags directly on the home page
- Boxed post excerpts arranged as a dated timeline with horizontal dividers
- No social links
- MathJax for `$inline$` and `$$display$$` mathematics
- A post format that works naturally in Obsidian: one folder per post, an `index.md`, and adjacent images

## 1. Create the GitHub repository

Your account name must be `lahavpadan`. Create a **public** repository named exactly:

```text
lahavpadan.github.io
```

That special repository name makes this a user site, so its public address is:

```text
https://lahavpadan.github.io
```

Do not create a repository named `blog` or `website`: that would create a project site with a longer URL.

## 2. Put this starter into the repository

Either upload this folder through GitHub's web interface, or run these commands from the root of this folder:

```bash
git init
git add .
git commit -m "Create technical notebook site"
git branch -M main
git remote add origin https://github.com/lahavpadan/lahavpadan.github.io.git
git push -u origin main
```

## 3. Turn on GitHub Pages

In the GitHub repository:

1. Open **Settings**.
2. Open **Pages** in the left sidebar.
3. Under **Build and deployment → Source**, select **GitHub Actions**.
4. Push to `main` again if GitHub does not start the workflow automatically.
5. Watch the **Actions** tab until the `Deploy Jekyll site to GitHub Pages` workflow succeeds.

The workflow in `.github/workflows/pages.yml` builds the site and deploys it. Do not configure branch deployment as well.

## 4. Preview locally (optional but useful)

Install Ruby first. Then, from the project root:

```bash
bundle install
bundle exec jekyll serve --livereload
```

Open the local address printed in the terminal, normally `http://127.0.0.1:4000`.

## 5. Write a new post — the Obsidian-style workflow

Open this whole repository as an Obsidian vault if you like. Each post lives in one self-contained folder:

```text
posts/
  my-new-topic/
    index.md
    diagram.svg
    result.png
```

1. Copy `templates/post-template.md` into `posts/my-new-topic/index.md`.
2. Fill in its front matter: title, description, date, tags, reading time, and whether it uses math.
3. Keep images alongside `index.md`.
4. Link them with normal Markdown, e.g. `![diagram](diagram.svg)`.
5. Commit and push. GitHub Pages will publish the change.

The required `layout: post` line is what makes a Markdown page appear in the home-page timeline. The `description` becomes its card excerpt and its search text.

### Recommended tag spelling

Use these exact spellings so their colours stay consistent:

```yaml
tags:
  - machine learning
  - cyber
  - cryptography
  - physics
  - electrical engineering
```

`mathematics` is also styled. Other tags still work; they simply use the neutral treatment until you add a colour in `assets/css/main.css`.

## 6. Add your photo to `whoami`

1. Put your image at `assets/images/whoami/profile.jpg`.
2. In `_config.yml`, change:

```yaml
profile_image: "/assets/images/whoami/profile-placeholder.svg"
```

to:

```yaml
profile_image: "/assets/images/whoami/profile.jpg"
```

3. Edit the prose in `whoami.md`.

The surrounding frame uses a monochrome treatment and technical corner marks. It lets a natural portrait feel part of the site without making the page look like a social profile.

A head-and-shoulders image with a quiet background works best. Do not bake a heavy filter into the photo; the CSS already applies the shared look.

## 7. Change the visual system

- **Colours and spacing:** `assets/css/main.css`
- **Search, tags, theme button:** `assets/js/site.js`
- **Navigation:** `_includes/header.html`
- **Page shell, fonts, MathJax:** `_layouts/default.html`
- **Article page layout:** `_layouts/post.html`
- **Site title / URL / profile image:** `_config.yml`

The deliberate combination is:

| Mathematical-note side | Cyber side |
| --- | --- |
| Georgia-like readable article typography | Monospace navigation and metadata |
| Restrained cards with explanatory excerpts | `~/` mark, cursor, query-like `whoami` language |
| Calm light canvas and clear equations | Green accent, thin dividers, date timeline |
| Accessible contrast and low visual noise | Small terminal cues instead of a full “hacker” skin |

## Directory map

```text
.
├── .github/workflows/pages.yml     # deploys GitHub Pages
├── _config.yml                     # site configuration
├── _includes/header.html           # upper navigation
├── _layouts/default.html           # shared page wrapper
├── _layouts/post.html              # article layout
├── assets/
│   ├── css/main.css                # all visual styling
│   ├── js/site.js                  # search, filters, theme toggle
│   └── images/                     # profile, favicon, diagrams
├── posts/                          # one folder per article
├── templates/post-template.md      # copy this for each new post
├── index.html                      # searchable, filterable home page
└── whoami.md                       # about page
```

## Before publishing

- Replace all sample posts in `posts/` with your own, or delete them.
- Update the writing in `whoami.md`.
- Add your photo.
- Confirm that no private material is committed: GitHub Pages sites are public.
