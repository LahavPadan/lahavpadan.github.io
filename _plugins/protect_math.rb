# frozen_string_literal: true

module ProtectMath
  # Match display math without consuming escaped dollar signs.
  DISPLAY_MATH = /
    (?<!\\)
    \$\$
    (.+?)
    (?<!\\)
    \$\$
  /mx.freeze

  # Match inline math while excluding $$...$$ blocks.
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

  # Kramdown can mistake a bare pipe inside math for a Markdown-table
  # separator. Replace only those pipes; leave the rest of the TeX unchanged.
  def self.protect_pipes(tex)
    tex.gsub(/(?<!\\)\|/) { '\\vert{}' }
  end

  def self.protect(content)
    return content if content.nil? || !content.include?('$')

    content = content.gsub(DISPLAY_MATH) do
      "$$#{protect_pipes(Regexp.last_match(1))}$$"
    end

    content.gsub(INLINE_MATH) do
      "$#{protect_pipes(Regexp.last_match(1))}$"
    end
  end
end

# Protect Markdown written directly inside pages and documents.
Jekyll::Hooks.register :documents, :pre_render do |document|
  document.content = ProtectMath.protect(document.content)
end

Jekyll::Hooks.register :pages, :pre_render do |page|
  page.content = ProtectMath.protect(page.content)
end

# include_relative is expanded before Kramdown runs, so protect the included
# Markdown at the point where Jekyll reads it.
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
