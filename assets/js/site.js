(function () {
  "use strict";

  function normalise(value) {
    return String(value || "").trim().toLocaleLowerCase();
  }

  function initTheme() {
    var root = document.documentElement;
    var toggle = document.querySelector("[data-theme-toggle]");
    var storedTheme = window.localStorage.getItem("theme");

    if (storedTheme === "light" || storedTheme === "dark") {
      root.dataset.theme = storedTheme;
    }

    function syncButton() {
      if (!toggle) return;
      var dark = root.dataset.theme === "dark";
      toggle.setAttribute("aria-pressed", String(dark));
      toggle.setAttribute("aria-label", dark ? "Use light theme" : "Use dark theme");
    }

    if (toggle) {
      toggle.addEventListener("click", function () {
        root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
        window.localStorage.setItem("theme", root.dataset.theme);
        syncButton();
      });
    }

    syncButton();
  }

  function initPostIndex() {
    var search = document.querySelector("[data-post-search]");
    var cards = Array.prototype.slice.call(document.querySelectorAll("[data-post-card]"));
    var filterButtons = Array.prototype.slice.call(document.querySelectorAll("[data-tag-filter]"));
    var postTagLinks = Array.prototype.slice.call(document.querySelectorAll("[data-post-tag]"));
    var emptyState = document.querySelector("[data-empty-state]");
    var count = document.getElementById("post-count");

    if (!cards.length || !filterButtons.length) return;

    function cardTags(card) {
      return String(card.dataset.tags || "")
        .split("||")
        .map(normalise)
        .filter(Boolean);
    }

    function availableTag(tag) {
      var candidate = normalise(tag);
      return filterButtons.some(function (button) {
        return normalise(button.dataset.tag) === candidate;
      });
    }

    function tagFromLocation() {
      var params = new URLSearchParams(window.location.search);
      return params.get("tag") || "all";
    }

    var activeTag = availableTag(tagFromLocation()) ? tagFromLocation() : "all";
    var query = "";

    function updateLocation() {
      var url = new URL(window.location.href);
      if (normalise(activeTag) === "all") {
        url.searchParams.delete("tag");
      } else {
        url.searchParams.set("tag", activeTag);
      }
      window.history.replaceState({}, "", url);
    }

    function applyFilters() {
      var selectedTag = normalise(activeTag);
      var searchText = normalise(query);
      var visible = 0;

      cards.forEach(function (card) {
        var matchesTag = selectedTag === "all" || cardTags(card).indexOf(selectedTag) !== -1;
        var searchable = [card.dataset.title, card.dataset.description, card.dataset.tags]
          .join(" ")
          .toLocaleLowerCase();
        var matchesSearch = !searchText || searchable.indexOf(searchText) !== -1;
        var matches = matchesTag && matchesSearch;

        card.hidden = !matches;
        card.classList.toggle("is-filtered-out", !matches);
        if (matches) visible += 1;
      });

      filterButtons.forEach(function (button) {
        button.setAttribute("aria-pressed", String(normalise(button.dataset.tag) === selectedTag));
      });

      if (count) count.textContent = visible + (visible === 1 ? " post" : " posts");
      if (emptyState) emptyState.hidden = visible !== 0;
    }

    function selectTag(tag, writeToUrl) {
      activeTag = availableTag(tag) ? tag : "all";
      if (writeToUrl) updateLocation();
      applyFilters();
    }

    filterButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        selectTag(button.dataset.tag, true);
      });
    });

    postTagLinks.forEach(function (link) {
      link.addEventListener("click", function (event) {
        event.preventDefault();
        selectTag(link.dataset.postTag, true);
        var heading = document.getElementById("posts-heading");
        if (heading) heading.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });

    if (search) {
      search.addEventListener("input", function () {
        query = search.value;
        applyFilters();
      });

      window.addEventListener("keydown", function (event) {
        var target = event.target;
        var typing = target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable);
        if (event.key === "/" && !typing) {
          event.preventDefault();
          search.focus();
        }
      });
    }

    window.addEventListener("popstate", function () {
      selectTag(tagFromLocation(), false);
    });

    applyFilters();
  }

  function initTableOfContents() {
    var toc = document.querySelector("[data-post-toc]");
    var list = document.querySelector("[data-post-toc-list]");
    var article = document.querySelector("[data-article-prose]");

    if (!toc || !list || !article) return;

    var usedIds = Object.create(null);
    Array.prototype.forEach.call(document.querySelectorAll("[id]"), function (element) {
      usedIds[element.id] = true;
    });

    function makeId(text, fallbackIndex) {
      var stem = text
        .toLocaleLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
      if (!stem) stem = "section-" + fallbackIndex;

      var candidate = stem;
      var suffix = 2;
      while (usedIds[candidate]) {
        candidate = stem + "-" + suffix;
        suffix += 1;
      }
      usedIds[candidate] = true;
      return candidate;
    }

    var headings = Array.prototype.slice.call(article.querySelectorAll("h2, h3"));
    if (!headings.length) return;

    headings.forEach(function (heading, index) {
      if (!heading.id) heading.id = makeId(heading.textContent, index + 1);

      var item = document.createElement("li");
      item.className = "toc-level-" + heading.tagName.slice(1);

      var link = document.createElement("a");
      link.href = "#" + heading.id;
      link.textContent = heading.textContent;

      item.appendChild(link);
      list.appendChild(item);
    });

    toc.hidden = false;
  }

  initTheme();
  initPostIndex();
  initTableOfContents();
}());
