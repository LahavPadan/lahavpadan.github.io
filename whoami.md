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

      <p>I try to build an understanding that can be explained clearly to someone without the assumed background. I am particularly interested in subjects that are well developed in the scholarly literature but are less commonly explored elsewhere. I want to help bridge that gap.</p>

      <p>I opened this blog because other people’s notes made a real difference when I was taking my first steps. This is my attempt to pass that on: to share what fascinates me and what I find beautiful in it, leave the intermediate steps visible, and make technical ideas feel less gated by jargon.</p>

      <figure class="whoami-quote">
        <blockquote>
          <p>In choosing what to do, we also reveal something about what we believe ought to be done.</p>
        </blockquote>

        <figcaption>
          <span>This is one part of Sartre’s philosophy that resonates with me.</span>
          <span>It is part of why I try to present ideas here in the way I think they should be presented, and why I chose to make those explanations public in the first place.</span>
        </figcaption>
      </figure>
    </div>
  </div>

  <div class="whoami__resources">
    <section class="whoami-panel whoami-panel--music" aria-labelledby="music-title">
      <h2 id="music-title">Some Music I Like</h2>

      <p class="music-copy">I like music a lot, and find it soothing. Some of my favorite artists are <a href="https://open.spotify.com/artist/76oY04bOzECod3aGVTDtzu" rel="noopener">Matilda Mann</a>, <a href="https://open.spotify.com/artist/47zz7sob9NUcODy0BTDvKx" rel="noopener">Sade</a>, and <a href="https://open.spotify.com/artist/1A9o3Ljt67pFZ89YtPPL5X" rel="noopener">Snoh Aalegra</a>, although you can also find me headbanging to songs by <a href="https://open.spotify.com/artist/2eUKkTNZsIuZzV95DM0cbt" rel="noopener" lang="he" dir="rtl">עדן בן זקן</a>, <a href="https://open.spotify.com/artist/28jEBK1RysfSUBHFofFflA" rel="noopener" lang="he" dir="rtl">אודיה</a>, and the like.</p>

      <div class="spotify-top-artists" aria-label="Top artists on Spotify">
        <img class="spotify-top-artists__background" src="{{ profile.spotify_top_artists[0].image }}" alt="" aria-hidden="true">
        <div class="spotify-top-artists__overlay" aria-hidden="true"></div>

        <div class="spotify-top-artists__inner">
          <p class="spotify-top-artists__title">Top Artists</p>

          <ol class="spotify-top-artists__list">
            {% for artist in profile.spotify_top_artists %}
              <li>
                <a class="spotify-top-artists__item" href="{{ artist.url }}" rel="noopener">
                  <img class="spotify-top-artists__cover" src="{{ artist.image }}" alt="" width="52" height="52" loading="lazy" decoding="async">
                  <span class="spotify-top-artists__info">
                    <span class="spotify-top-artists__artist"{% if artist.lang %} lang="{{ artist.lang }}" dir="{{ artist.dir }}"{% endif %}>{{ artist.name }}</span>
                    <span class="spotify-top-artists__type">Top Artist</span>
                  </span>
                </a>
              </li>
            {% endfor %}
          </ol>
        </div>
      </div>
    </section>

    <section class="whoami-panel whoami-panel--blogs" aria-labelledby="blogs-title">
      <h2 id="blogs-title">Blogs I Would Recommend to Others</h2>

      <ul class="whoami-blog-grid">
        {% for blog in profile.recommended_blogs %}
          <li class="whoami-blog-card">
            <a href="{{ blog.url }}" rel="noopener">{{ blog.name }}</a>
            {% if blog.note %}<span>{{ blog.note }}</span>{% endif %}
          </li>
        {% endfor %}
      </ul>
    </section>
  </div>
</section>
