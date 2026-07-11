# frozen_string_literal: true

module ProtectMath
  # $$...$$, including several expressions on the same prose line.
  DISPLAY_MATH = /
    (?<!\\)
    \$\$
    (.+?)
    (?<!\\)
    \$\$
  /mx.freeze

  # $...$, while excluding $$...$$.
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
  /x.freeze

  # Remove literal pipe characters before Kramdown sees them.
  #
  # \vert{} is valid TeX and displays as the same single vertical bar,
  # but it cannot be mistaken for a Markdown table separator.
  def self.protect_pipes(tex)
    tex.gsub(/(?<!\\)\|/) { '\\vert{}' }
  end

  def self.protect(content)
    return content if content.nil? || !content.include?('$')

    # Protect pipes in $$...$$ expressions.
    content = content.gsub(DISPLAY_MATH) do
      inner = protect_pipes(Regexp.last_match(1))
      "$$#{inner}$$"
    end

    # Protect pipes and Kramdown-sensitive underscores in $...$ expressions.
    content.gsub(INLINE_MATH) do
      inner = protect_pipes(Regexp.last_match(1))
      inner = inner.gsub(/(?<!\\)_/) { '\\_' }

      "$#{inner}$"
    end
  end
end

# Protect Markdown written directly inside normal pages/documents.
Jekyll::Hooks.register :documents, :pre_render do |document|
  document.content = ProtectMath.protect(document.content)
end

Jekyll::Hooks.register :pages, :pre_render do |page|
  page.content = ProtectMath.protect(page.content)
end

# The important part:
# intercept {% include_relative article.md %} and protect the included
# Markdown before Liquid hands it to Kramdown.
module Jekyll
  module Tags
    class ProtectedIncludeRelativeTag < IncludeRelativeTag
      def read_file(file, context)
        ProtectMath.protect(super)
      end
    end
  end
end

Liquid::Template.register_tag(
  'include_relative',
  Jekyll::Tags::ProtectedIncludeRelativeTag
)