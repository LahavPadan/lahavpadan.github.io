# Google indexing kit for `lahavpadan.github.io`

This folder contains the files and snippets needed to make your GitHub Pages/Jekyll site easier for Google to crawl and understand.

## What to copy where

### 1. `Gemfile`
Replace your repository's `Gemfile` with the supplied one **only if** your current Gemfile is similarly minimal.
If you already have other gems, keep them and add these two lines:

```ruby
gem "jekyll-sitemap", "~> 1.4"
gem "jekyll-seo-tag", "~> 2.8"
```

### 2. `_config.yml`
Replace your current `_config.yml` with this file only after checking that you do not have site-specific configuration you want to preserve.

Important:
- Keep `url: "https://lahavpadan.github.io"`
- When Google Search Console gives you a verification token, replace:
  `PASTE_GOOGLE_VERIFICATION_TOKEN_HERE`
  with the value inside the `content="..."` attribute.

### 3. `robots.txt`
Copy this to the **root of the repository**.

### 4. `_layouts/default.html`
Do **not** blindly replace your whole layout with this file.
Open your existing `_layouts/default.html`, then merge the contents of:
`snippets/seo-head-snippet.liquid`
inside its `<head>` section, preferably just before `</head>`.

Remove any old manually-created `<title>`, meta description, or canonical URL tags first, otherwise you may create duplicates.

### 5. `404.html`
Add `sitemap: false` to the YAML block at the top of your current `404.html`.

### 6. `index-front-matter.yml`
Replace only the YAML front matter at the top of your homepage file (`index.html` or `index.md`) with this content.
Keep the rest of the homepage HTML/Markdown unchanged.

## After you push

Wait for your GitHub Pages deployment to succeed, then open:

- https://lahavpadan.github.io/robots.txt
- https://lahavpadan.github.io/sitemap.xml

The sitemap is generated automatically by the `jekyll-sitemap` plugin. Do not manually create a `sitemap.xml` file.

## Google Search Console steps

1. Open Google Search Console.
2. Add a new property using **URL prefix**:
   `https://lahavpadan.github.io/`
3. Select **HTML tag** verification.
4. Copy only the verification token from:
   `<meta name="google-site-verification" content="TOKEN_GOES_HERE">`
5. Put it in `_config.yml` in the `google_site_verification` field.
6. Push the change.
7. Click **Verify** in Search Console.
8. Go to **Sitemaps**, submit:
   `sitemap.xml`
9. Use **URL inspection** and request indexing for the homepage and your most important articles.

## Sanity checks

Run these after deployment:

```text
https://lahavpadan.github.io/robots.txt
https://lahavpadan.github.io/sitemap.xml
```

Then later search Google for:

```text
site:lahavpadan.github.io
```
