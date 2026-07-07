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

## Jekyll-safe post-folder convention

Each post folder must contain:

```text
posts/<post-slug>/
├── index.md
├── article.md
└── images or other local assets
```

- `index.md` holds the YAML metadata and ends with:

  ```liquid
  {% include_relative article.md %}
  ```

- `article.md` holds the actual article content.

Do not use spaces, apostrophes, parentheses, or variable expressions inside
`include_relative` filenames. Keeping every body file named `article.md`
avoids Jekyll/Liquid parsing failures.

## Math and code syntax used by this site

The site is built with **Kramdown + MathJax**, not Obsidian's renderer. Kramdown
protects math from Markdown emphasis parsing only when math uses a double-dollar
delimiter:

```md
Inline: $$\mathbb{F}_p$$

Display:
$$
\pi_q^2 - t\pi_q + q = 0
$$
```

Do **not** use single-dollar inline math (`$...$`) in files published to the
site. With the GFM parser, underscores in a formula such as
`$\mathbb{F}_p$` can be consumed as Markdown emphasis before MathJax sees the
formula.

For fenced code, use `~~~` rather than triple backticks so the native Kramdown
parser handles it consistently:

~~~md
~~~python
print("example")
~~~
~~~

Each post's `accent:` front-matter field selects its article colour family.
Supported values are `machine-learning`, `cyber`, `cryptography`,
`physics`, `electrical-engineering`, `mathematics`, and `signal-processing`.
