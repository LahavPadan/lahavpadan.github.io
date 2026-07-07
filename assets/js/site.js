(function () {
  'use strict';

  var root = document.documentElement;
  var toggle = document.querySelector('[data-theme-toggle]');

  function setThemeButtonState() {
    if (!toggle) return;
    var isDark = root.dataset.theme === 'dark';
    toggle.setAttribute('aria-pressed', String(isDark));
    toggle.setAttribute('aria-label', isDark ? 'Use light theme' : 'Use dark theme');
  }

  setThemeButtonState();

  if (toggle) {
    toggle.addEventListener('click', function () {
      root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('theme', root.dataset.theme);
      setThemeButtonState();
    });
  }

  var search = document.querySelector('[data-post-search]');
  var cards = Array.prototype.slice.call(document.querySelectorAll('[data-post-card]'));
  var filterButtons = Array.prototype.slice.call(document.querySelectorAll('[data-tag-filter]'));
  var postTagLinks = Array.prototype.slice.call(document.querySelectorAll('[data-post-tag]'));
  var emptyState = document.querySelector('[data-empty-state]');
  var count = document.getElementById('post-count');

  if (!cards.length || !filterButtons.length) return;

  function normalise(value) {
    return String(value || '').trim().toLocaleLowerCase();
  }

  function cardTags(card) {
    return String(card.dataset.tags || '')
      .split('||')
      .map(normalise)
      .filter(Boolean);
  }

  function tagFromLocation() {
    var params = new URLSearchParams(window.location.search);
    return params.get('tag') || 'all';
  }

  function knownTag(tag) {
    var candidate = normalise(tag);
    return filterButtons.some(function (button) {
      return normalise(button.dataset.tag) === candidate;
    });
  }

  var activeTag = knownTag(tagFromLocation()) ? tagFromLocation() : 'all';
  var query = '';

  function updateUrl() {
    var url = new URL(window.location.href);
    if (normalise(activeTag) === 'all') {
      url.searchParams.delete('tag');
    } else {
      url.searchParams.set('tag', activeTag);
    }
    window.history.replaceState({}, '', url);
  }

  function applyFilters() {
    var queryText = normalise(query);
    var selectedTag = normalise(activeTag);
    var visible = 0;

    cards.forEach(function (card) {
      var tags = cardTags(card);
      var searchableText = [card.dataset.title, card.dataset.description, card.dataset.tags]
        .join(' ')
        .toLocaleLowerCase();
      var matchesTag = selectedTag === 'all' || tags.indexOf(selectedTag) !== -1;
      var matchesQuery = !queryText || searchableText.indexOf(queryText) !== -1;
      var matches = matchesTag && matchesQuery;

      card.hidden = !matches;
      card.classList.toggle('is-filtered-out', !matches);
      if (matches) visible += 1;
    });

    filterButtons.forEach(function (button) {
      var selected = normalise(button.dataset.tag) === selectedTag;
      button.setAttribute('aria-pressed', String(selected));
    });

    if (count) count.textContent = visible + (visible === 1 ? ' post' : ' posts');
    if (emptyState) emptyState.hidden = visible !== 0;
  }

  function selectTag(tag, shouldUpdateUrl) {
    activeTag = knownTag(tag) ? tag : 'all';
    if (shouldUpdateUrl) updateUrl();
    applyFilters();
  }

  filterButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      selectTag(button.dataset.tag, true);
    });
  });

  postTagLinks.forEach(function (link) {
    link.addEventListener('click', function (event) {
      event.preventDefault();
      selectTag(link.textContent, true);
      var postsHeading = document.getElementById('posts-heading');
      if (postsHeading) postsHeading.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  if (search) {
    search.addEventListener('input', function () {
      query = search.value;
      applyFilters();
    });

    window.addEventListener('keydown', function (event) {
      var target = event.target;
      var isTyping = target && (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      );

      if (event.key === '/' && !isTyping) {
        event.preventDefault();
        search.focus();
      }
    });
  }

  window.addEventListener('popstate', function () {
    selectTag(tagFromLocation(), false);
  });

  applyFilters();
}());
