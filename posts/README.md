# Post folders

Each post folder follows this convention:

```text
some-post/
  index.md
  article.md
  image-or-diagram.svg
```

- `index.md` contains front matter: title, date, tags, entry type, and `math`.
- `article.md` contains the Markdown that becomes the article body.
- Images and other assets remain next to `article.md`.

The last line of `index.md` is:

```liquid
{% include_relative article.md %}
```

That is what inserts the sibling article file into the published page.
