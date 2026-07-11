# frozen_string_literal: true
#
# _plugins/protect_math.rb
#
# Kramdown's inline parser treats `|` and `_` as active characters. Both are
# fine 99% of the time, but they turn destructive when they occur inside a
# `$...$` inline math run, because kramdown parses source without knowing
# that MathJax will later interpret those characters as LaTeX.
#
#   * `|` triggers table detection. Kramdown's TABLE_LINE regex fires on any
#     paragraph line containing an unescaped `|`
#     (see kramdown/parser/kramdown/table.rb; TABLE_PIPE_CHECK is
#     `(?:\||.*?[^\\\n]\|)`). A paragraph like
#
#         Dividing by $|P| \cdot |N|$ — total pairs.
#
#     gets parsed as a single-row table with cells "Dividing by $", "P",
#     "\cdot", "N", "$ — total pairs.", and the article renders as broken
#     multi-column HTML instead of prose with a typeset formula.
#
#   * `_` triggers intra-word emphasis. A chemical formula like
#     `Y$_3$Fe$_5$O$_{12}$` has three underscores where kramdown's emphasis
#     rules say the first (in `$_3$`) can open and the last (in `$_{12}$`)
#     can close. Kramdown wraps the middle in `<em>`, MathJax sees a broken
#     text stream around an element boundary, and the elements Ga, O, Fe
#     drop out. The rendered text becomes gibberish like `Y$3_5{12}^{3+}$`.
#
# This hook rewrites the raw markdown before kramdown converts it: every
# unescaped `|` and every unescaped `_` inside a `$...$` inline math run is
# escaped as `\|` / `\_`. Kramdown's TABLE_LINE regex and emphasis parser
# now see escaped characters and skip them. Kramdown's inline parser then
# reads `\|` and `\_` as literal `|` and `_` (both are in the ESCAPED_CHARS
# set — see kramdown/parser/kramdown/escaped_chars.rb), so the HTML that
# reaches MathJax carries the original characters and the math typesets
# correctly.
#
# Display math (`$$...$$`) is left alone: it always sits on its own paragraph
# and the surrounding `$$` neutralises both kramdown ambiguities in practice.

module ProtectMath
  # A `$...$` inline math run. We match single-dollar boundaries only, so
  # display math (`$$...$$`) is safe.
  #
  # Guards:
  #   * `(?<![\\$])` — opening `$` is not preceded by `\` (escaped dollar)
  #     nor by another `$` (part of `$$`).
  #   * `(?!\$)`     — opening `$` is not followed by another `$`.
  #   * The inner content forbids raw `$` and newline. Line breaks and
  #     stray dollars in prose can't accidentally start a runaway match.
  #     `\$` inside math is allowed (a literal dollar written in LaTeX).
  #   * `(?<!\\)` on the closing `$` — cannot be preceded by `\`.
  #   * `(?!\$)` on the closing `$` — cannot form the front of a `$$`.
  INLINE_MATH = /
    (?<![\\$])
    \$
    (?!\$)
    (
      (?:\\\$|[^\$\n])+?
    )
    (?<!\\)
    \$
    (?!\$)
  /x

  # Escape unescaped `|` and `_` inside the captured math content. Existing
  # `\|` (LaTeX norm/concatenation) and `\_` (already-escaped underscore)
  # are left alone thanks to the lookbehind.
  def self.protect(content)
    return content if content.nil?
    return content unless content.include?('$')
    return content unless content.include?('|') || content.include?('_')
    content.gsub(INLINE_MATH) do
      inner = Regexp.last_match(1)
      inner = inner.gsub(/(?<!\\)\|/) { '\\|' }
      inner = inner.gsub(/(?<!\\)_/)  { '\\_' }
      '$' + inner + '$'
    end
  end
end

Jekyll::Hooks.register :documents, :pre_render do |doc|
  doc.content = ProtectMath.protect(doc.content)
end

Jekyll::Hooks.register :pages, :pre_render do |page|
  page.content = ProtectMath.protect(page.content)
end
