---
layout: default
title: whoami
description: About Lahav Padan.
permalink: /whoami/
---
{% assign profile = site.data.whoami %}
<section class="shell whoami" aria-labelledby="whoami-title">
  <header class="whoami__header">
    <p class="whoami__path">~/lahavpadan.github.io/</p>
    <h1 id="whoami-title">whoami</h1>
  </header>

  <div class="whoami__profile">
    <figure class="portrait-frame">
      <picture>
        <source srcset="{{ '/assets/images/whoami/me.webp' | relative_url }}" type="image/webp">
        <img src="{{ '/assets/images/whoami/me.jpg' | relative_url }}" alt="Portrait of Lahav Padan" width="600" height="600" loading="lazy" decoding="async">
      </picture>
    </figure>

    <div class="whoami__copy">
      <p class="whoami__lead">I am curious about <span class="accent-word">how things truly work</span> — and about the ordinary questions we rarely stop to ask.</p>
      <p>I try to build an understanding that can be explained clearly to someone without the assumed background, while still keeping the important machinery visible. I like to start with the central idea and its connections across fields, then zoom in until the smaller details have a place and a reason.</p>
      <p>I opened this blog because other people’s notes made a real difference when I was taking my first steps. This is my attempt to pass that on: to share the excitement of learning, leave the intermediate steps visible, and make technical ideas feel less gated by jargon.</p>
      <p class="whoami__aside">These notes are records of thinking. They are allowed to remain unfinished while the ideas become clearer.</p>
    </div>
  </div>

  <div class="whoami__resources">
    <section class="whoami-panel" aria-labelledby="reading-title">
      <h2 id="reading-title">blogs I would recommend to others</h2>
      <ul class="reading-list">
        {% for blog in profile.recommended_blogs %}
          <li>
            <a href="{{ blog.url }}" rel="noopener">{{ blog.name }}</a>
            {% if blog.note %}<span>{{ blog.note }}</span>{% endif %}
          </li>
        {% endfor %}
      </ul>
    </section>
  </div>
</section>
