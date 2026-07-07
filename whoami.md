---
layout: default
title: whoami
description: About Lahav Padan.
permalink: /whoami/
---
{% assign profile = site.data.whoami %}
<section class="shell whoami" aria-labelledby="whoami-title">
  <div class="terminal-heading">
    <p class="terminal-heading__path">~/lahavpadan.github.io/</p>
    <h1 id="whoami-title"><span aria-hidden="true">$ </span>whoami</h1>
  </div>

  <div class="whoami__grid">
    <div class="portrait-frame">
      <div class="portrait-frame__corner portrait-frame__corner--one" aria-hidden="true"></div>
      <div class="portrait-frame__corner portrait-frame__corner--two" aria-hidden="true"></div>
      <img src="{{ site.profile_image | relative_url }}" alt="Portrait of Lahav Padan" width="720" height="900">
      <p class="portrait-frame__caption">lahav padan · notes in progress</p>
    </div>

    <div class="whoami__copy">
      <p class="whoami__eyebrow">A little about how I learn</p>
      <p class="whoami__lead">I am drawn to questions that reveal how things truly work — especially the ordinary things we rarely stop to question.</p>
      <p>I try to reach an understanding that is clean enough to explain without assumed background, but precise enough not to hide the machinery. I like to begin with the central idea and its connections across fields, then keep zooming in until the smaller technical details have a place and a reason.</p>
      <p>I started this blog because other people’s notes made a real difference when I was taking my first steps. This is my attempt to pass that on: to share the excitement of learning, leave intermediate steps visible, and make technical ideas feel less gated by jargon.</p>
      <div class="whoami__note"><span aria-hidden="true">→</span> Notes are kept as a record of thinking, not as a claim that the thinking is finished.</div>
    </div>
  </div>

  <div class="whoami__rule" aria-hidden="true"></div>

  <div class="whoami__resources">
    <section class="whoami-panel" aria-labelledby="areas-title">
      <h2 id="areas-title"><span aria-hidden="true"># </span>areas of focus</h2>
      <ul class="area-list">
        {% for area in profile.areas_of_expertise %}
          <li>
            <span class="area-list__name">{{ area.name }}</span>
            {% if area.note %}<span class="area-list__note">{{ area.note }}</span>{% endif %}
          </li>
        {% endfor %}
      </ul>
    </section>

    <section class="whoami-panel" aria-labelledby="reading-title">
      <h2 id="reading-title"><span aria-hidden="true"># </span>notes worth visiting</h2>
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
