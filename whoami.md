---
layout: default
title: whoami
description: About Lahav Padan.
permalink: /whoami/
---
{% assign profile = site.data.whoami %}

~/lahavpadan.github.io/
# whoami

I am curious about how things truly work — and about the ordinary questions we rarely stop to ask.

I try to build an understanding that can be explained clearly to someone without the assumed background, while still keeping the important machinery visible. I like to start with the central idea and its connections across fields, then zoom in until the smaller details have a place and a reason.

I opened this blog because other people’s notes made a real difference when I was taking my first steps. This is my attempt to pass that on: to share the excitement of learning, leave the intermediate steps visible, and make technical ideas feel less gated by jargon.

One who learns in order to teach is enabled to learn and to teach.
— Rabbi Ishmael, Pirkei Avot 4:5

## blogs I would recommend to others

<ul class="whoami-blog-grid">
{% for blog in profile.recommended_blogs %}
  <li class="whoami-blog-card">
    <a href="{{ blog.url }}">{{ blog.name }}</a>
    {% if blog.note %}<span>{{ blog.note }}</span>{% endif %}
  </li>
{% endfor %}
</ul>
