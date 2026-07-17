# frozen_string_literal: true

require 'jekyll'
require 'liquid'
require_relative 'article_structure'

module Jekyll
  module Converters
    class Markdown
      # Selected by `markdown: GuidedKramdown` in _config.yml; Jekyll resolves
      # that name against this class's constants, so the subclass has to live
      # here.
      #
      # Kramdown parses to an element tree and converts it to HTML in a single
      # call. The article structure has to be applied in between, which is the
      # only reason this class exists.
      class GuidedKramdown < KramdownParser
        def convert(content)
          document = Kramdown::JekyllDocument.new(content, @config)
          LahavBlog::ArticleStructure.record(LahavBlog::ArticleStructure.apply(document.root))
          document.to_html
        end
      end
    end
  end
end

module LahavBlog
  module ArticleStructure
    class << self
      attr_reader :current

      def record(chapters)
        @current = chapters
      end
    end
  end

  # Publishes the chapters of the article being rendered, so a layout can build
  # its own navigation:
  #
  #   {% article_chapters %}
  #   {% for chapter in chapters %} ... {% endfor %}
  #
  # A converter is handed content and nothing else, so it cannot reach the page
  # it belongs to; and a page's Liquid payload is a copy of its data taken
  # before conversion (Jekyll::Renderer#assign_pages!), so a hook cannot reach
  # the layout either. Jekyll renders one page at a time and lays it out
  # immediately after converting it (Jekyll::Renderer#render_document), so the
  # chapters recorded by the last conversion are this page's. Every conversion
  # records, so the value cannot go stale.
  class ArticleChaptersTag < Liquid::Tag
    def render(context)
      context.scopes.last['chapters'] = ArticleStructure.current || []
      ''
    end
  end
end

Liquid::Template.register_tag('article_chapters', LahavBlog::ArticleChaptersTag)
