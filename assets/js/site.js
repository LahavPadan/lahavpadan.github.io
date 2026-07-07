(function () {
  const root = document.documentElement;
  const toggle = document.querySelector('[data-theme-toggle]');
  const icon = document.querySelector('[data-theme-icon]');

  function updateThemeButton() {
    if (!toggle) return;
    const isDark = root.dataset.theme === 'dark';
    toggle.setAttribute('aria-pressed', String(isDark));
    toggle.setAttribute('aria-label', isDark ? 'Use light theme' : 'Use dark theme');
    if (icon) icon.textContent = isDark ? '☀' : '◐';
  }

  updateThemeButton();
  if (toggle) {
    toggle.addEventListener('click', function () {
      root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('theme', root.dataset.theme);
      updateThemeButton();
    });
  }

  const search = document.querySelector('[data-post-search]');
  const cards = Array.from(document.querySelectorAll('[data-post-card]'));
  const filters = document.querySelector('[data-tag-filters]');
  const empty = document.querySelector('[data-empty-state]');
  const count = document.getElementById('post-count');

  if (!cards.length || !filters) return;

  const tags = [...new Set(cards.flatMap(function (card) {
    return (card.dataset.tags || '').split('|').map(function (tag) { return tag.trim(); }).filter(Boolean);
  }))].sort(function (a, b) { return a.localeCompare(b); });

  let activeTag = new URLSearchParams(window.location.search).get('tag') || 'all';
  let query = '';

  function slugify(value) {
    return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }

  function makeFilter(tag) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = tag === 'all' ? 'tag-filter' : 'tag-filter tag--' + slugify(tag);
    button.textContent = tag === 'all' ? 'all fields' : tag;
    button.dataset.tag = tag;
    button.setAttribute('aria-pressed', 'false');
    button.addEventListener('click', function () {
      activeTag = tag;
      const url = new URL(window.location.href);
      if (tag === 'all') url.searchParams.delete('tag'); else url.searchParams.set('tag', tag);
      window.history.replaceState({}, '', url);
      applyFilters();
    });
    return button;
  }

  filters.appendChild(makeFilter('all'));
  tags.forEach(function (tag) { filters.appendChild(makeFilter(tag)); });
  if (!tags.includes(activeTag)) activeTag = 'all';

  function applyFilters() {
    const normalizedQuery = query.toLowerCase().trim();
    let visible = 0;

    cards.forEach(function (card) {
      const cardTags = (card.dataset.tags || '').split('|').map(function (tag) { return tag.trim(); });
      const haystack = [card.dataset.title, card.dataset.description, card.dataset.tags].join(' ').toLowerCase();
      const tagMatch = activeTag === 'all' || cardTags.includes(activeTag);
      const queryMatch = !normalizedQuery || haystack.includes(normalizedQuery);
      const matches = tagMatch && queryMatch;
      card.hidden = !matches;
      if (matches) visible += 1;
    });

    filters.querySelectorAll('[data-tag]').forEach(function (button) {
      button.setAttribute('aria-pressed', String(button.dataset.tag === activeTag));
    });
    if (count) count.textContent = visible + (visible === 1 ? ' post' : ' posts');
    if (empty) empty.hidden = visible !== 0;
  }

  if (search) {
    search.addEventListener('input', function () {
      query = search.value;
      applyFilters();
    });
    window.addEventListener('keydown', function (event) {
      const target = event.target;
      const writing = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable);
      if (event.key === '/' && !writing) {
        event.preventDefault();
        search.focus();
      }
    });
  }

  applyFilters();
}());
