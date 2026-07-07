---
layout: default
title: whoami
description: About Lahav Padan.
permalink: /whoami/
---
{% assign profile = site.data.whoami %}
<section class="shell whoami" aria-labelledby="whoami-title">
  <div class="whoami__grid">
    <div class="portrait-frame">
      <div class="portrait-frame__corner portrait-frame__corner--one" aria-hidden="true"></div>
      <div class="portrait-frame__corner portrait-frame__corner--two" aria-hidden="true"></div>
      <img src="{{ site.profile_image | relative_url }}" alt="Portrait of Lahav Padan" width="720" height="900">
      <p class="portrait-frame__caption">lahav padan · notes in progress</p>
    </div>

    <div class="whoami__copy">
      <h1 id="whoami-title">whoami</h1>
      <p>I am curious about many things: how they truly work, and how they explain ordinary parts of life that we rarely stop to question.</p>
      <p>I try to build an understanding that is clean enough to explain to a layperson without losing what makes it true. I like to start with the central idea and the connections across fields, then zoom in until the small technical details make sense too.</p>
      <p>I opened this blog because other people’s notes made a real difference when I was taking my first steps. This is my attempt to pass that on: to share the excitement of learning, leave the intermediate steps visible, and make technical ideas feel less gated by jargon or assumed background.</p>
    </div>
  </div>

  <div class="whoami__rule" aria-hidden="true"></div>

  <div class="whoami__resources">
    <section class="whoami-panel" aria-labelledby="areas-title">
      <h2 id="areas-title">Areas of focus</h2>
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
      <h2 id="reading-title">Notes worth visiting</h2>
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
