# Apply this visual and table-of-contents update

Copy every file in this package into the root of your local `lahavpadan.github.io` repository, preserving its paths and replacing matching files.

The package changes:

```text
index.html
whoami.md
_layouts/post.html
_data/whoami.yml
assets/css/main.css
assets/js/site.js
posts/taylor-theorem/index.md
```

Then run:

```bash
git add index.html whoami.md _layouts/post.html _data/whoami.yml assets/css/main.css assets/js/site.js posts/taylor-theorem/index.md
git commit -m "Refine homepage, whoami, palettes, and contents navigation"
git push
```

## What the update does

- Keeps the photo at its real square proportions. The image is no longer cropped into a tall frame; it sits as a smaller framed image inside the `whoami` text flow.
- Removes `lahav padan · notes in progress` and the Areas of focus panel.
- Renames the recommendation block to `blogs I would recommend to others`.
- Replaces the `> posts` prefix with a plain `posts` heading and a short two-colour rule.
- Adds a small ASCII circuit mark near `hi,` and places `I’m Lahav Padan` on the line below in a smaller size.
- Uses Fira Sans for the homepage sentence `It is as good a time as any to show what I am working on.`
- Gives every post a two-colour palette determined by the `accent:` field, or inferred from tags when the field is absent.
- Adds an automatic table of contents to every post whose front matter has `entry_type: comprehensive`. It is built from the `##` and `###` headings in `article.md`.
- Corrects Taylor's Theorem from `signal-processing` to `mathematics`.

## Entry colours

Set one of these on any post's `index.md` if you want to choose its palette explicitly:

```yaml
accent: mathematics
accent: machine-learning
accent: cyber
accent: cryptography
accent: physics
accent: electrical-engineering
accent: signal-processing
```

A primary colour drives headings, links, and the main equation edge. A companion colour appears in subheadings, equation text, card details, and accent rules.
