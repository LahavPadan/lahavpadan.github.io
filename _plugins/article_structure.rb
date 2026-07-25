# frozen_string_literal: true

require 'kramdown'

module LahavBlog
  # Derives the reading structure of an article from its headings.
  #
  # The structure is a pure function of the document: the same headings always
  # produce the same chapters, the same subsections and the same table of
  # contents. Work of that kind belongs to the build, which runs once, rather
  # than to every page load in every browser.
  #
  # Kramdown has already parsed the article by the time this runs, so the
  # transformation is applied to its element tree. Nothing here re-parses HTML
  # or matches on prose.
  module ArticleStructure
    CHAPTER_HEADING = /\A§\s*([^.\s]+(?:\.[^.\s]+)*)\.?\s*(.*)\z/m.freeze
    LINKED_LEVELS = [2, 3, 4].freeze

    class << self
      # Returns the chapters, in document order, and leaves `root` holding the
      # sectioned article.
      def apply(root)
        fold_disclosures(root)
        assign_heading_ids(root)
        build_chapters(root)
      end

      # -- disclosures ----------------------------------------------------
      #
      # A fold is authored as a pair of empty marker divs. Folds never contain
      # a chapter or subsection heading, so resolving them before the sections
      # are built leaves each <details> wholly inside one subsection.

      def fold_disclosures(root)
        loop do
          start = root.children.index { |child| marker?(child, 'guided-fold-start') }
          break unless start

          stop = root.children.index { |child| marker?(child, 'guided-fold-end') }
          break unless stop && stop > start

          marker = root.children[start]
          tone = marker.attr['data-tone'] == 'proof' ? 'proof' : 'derivation'
          body = root.children[(start + 1)...stop]

          root.children[start..stop] = [disclosure(marker, tone, body)]
        end
      end

      def disclosure(marker, tone, body)
        label = marker.attr['data-label'] ||
                (tone == 'proof' ? 'Supporting proof' : 'Supporting derivation')

        attr = { 'class' => "guided-disclosure guided-disclosure--#{tone}" }
        attr['open'] = 'open' if marker.attr['data-open'] == 'true'

        block('details', attr, [
          summary(label, tone),
          block('div', { 'class' => 'guided-disclosure__body' }, body)
        ])
      end

      def summary(label, tone)
        block('summary', { 'class' => 'guided-disclosure__summary' }, [
          span('guided-disclosure__icon', nil, 'aria-hidden' => 'true'),
          span('guided-disclosure__label', label),
          span('guided-disclosure__hint', tone == 'proof' ? 'proof' : 'derivation')
        ])
      end

      # -- heading ids ----------------------------------------------------
      #
      # Kramdown's HTML converter derives an id for every heading that lacks
      # one. Deriving them here instead, by the same rule and in the same
      # order, keeps every existing anchor working while making the ids
      # available to the table of contents, which is built before conversion.

      def assign_heading_ids(root)
        used = {}
        each_heading(root) do |heading|
          next unless LINKED_LEVELS.include?(heading.options[:level])

          heading.attr['id'] ||= unique_id(heading.options[:raw_text].to_s, used)
        end
      end

      # Kramdown::Converter::Base#generate_id, which is not reachable outside a
      # converter instance.
      def unique_id(text, used)
        id = text.gsub(/^[^a-zA-Z]+/, '')
        id.tr!('^a-zA-Z0-9 -', '')
        id.tr!(' ', '-')
        id.downcase!
        id = 'section' if id.nil? || id.empty?

        if used.key?(id)
          "#{id}-#{used[id] += 1}"
        else
          used[id] = 0
          id
        end
      end

      # -- heading text ---------------------------------------------------
      #
      # `raw_text` is the markdown a heading was written as, which is what
      # kramdown derives an id from, but not what a reader sees: `$x$` is still
      # a dollar sign there, and an apostrophe is still straight. A title has
      # to read as the heading reads, so it is taken from the converted tree.
      # Only these five types occur inside a heading in this blog.
      def heading_text(heading)
        heading.children.map { |child| text_of(child) }.join
      end

      def text_of(element)
        case element.type
        when :text, :codespan then element.value
        when :math then "\\(#{element.value}\\)"
        when :smart_quote then Kramdown::Utils::Entities.entity(element.value.to_s).char
        else element.children.map { |child| text_of(child) }.join
        end
      end

      def each_heading(element, &block)
        element.children.each do |child|
          block.call(child) if child.type == :header
          each_heading(child, &block)
        end
      end

      # -- sections -------------------------------------------------------

      def build_chapters(root)
        root.children.each do |child|
          child.attr['class'] = 'article-internal-title' if heading?(child, 1)
          child.attr['class'] = 'chapter-divider-source' if child.type == :hr
        end

        chapters = []
        grouped = []
        current = nil

        root.children.each do |child|
          if heading?(child, 2)
            current = block('section', { 'class' => 'article-chapter' }, [child])
            grouped << current
          elsif current
            current.children << child
          else
            grouped << child
          end
        end

        grouped.each_with_index do |node, index|
          next unless node.attr['class'] == 'article-chapter'

          chapters << finish_chapter(node, chapters.length)
        end

        root.children.replace(grouped)
        chapters
      end

      def finish_chapter(chapter, index)
        heading = chapter.children.first
        number, title = split_heading(heading_text(heading), index)

        chapter.attr['data-chapter-number'] = number
        chapter.attr['data-chapter-title'] = title
        heading.children.replace([
          span('chapter-heading__number', "§ #{number}"),
          span('chapter-heading__title', title)
        ])

        lead = chapter.children.find { |child| child.type == :p }
        lead.attr['class'] = [lead.attr['class'], 'chapter-lead'].compact.join(' ').strip if lead

        {
          'number' => number, 'title' => title, 'id' => heading.attr['id'],
          'subsections' => wrap_subsections(chapter)
        }
      end

      def split_heading(raw, index)
        match = CHAPTER_HEADING.match(raw.strip)
        return [String(index + 1), raw.strip] unless match

        [match[1], match[2].empty? ? raw.strip : match[2]]
      end

      def wrap_subsections(chapter)
        grouped = []
        current = nil
        subsections = []

        chapter.children.each do |child|
          if heading?(child, 3)
            child.attr['data-guided-subsection'] = 'true'
            current = block('section', { 'class' => 'article-subsection' }, [child])
            grouped << current
            subsections << { 'title' => heading_text(child).strip,
                             'id' => child.attr['id'] }
          elsif current
            current.children << child
          else
            grouped << child
          end
        end

        chapter.children.replace(grouped)
        subsections
      end

      # -- element helpers -------------------------------------------------

      def block(tag, attr, children)
        element = Kramdown::Element.new(:html_element, tag, attr,
                                        category: :block, content_model: :block)
        element.children.concat(children)
        element
      end

      def span(css_class, text, extra = {})
        element = Kramdown::Element.new(:html_element, 'span',
                                        { 'class' => css_class }.merge(extra),
                                        category: :span, content_model: :span)
        element.children << Kramdown::Element.new(:text, text) if text
        element
      end

      def heading?(element, level)
        element.type == :header && element.options[:level] == level
      end

      def marker?(element, css_class)
        element.type == :html_element && element.value == 'div' &&
          element.attr['class'].to_s.split.include?(css_class)
      end

    end
  end
end
