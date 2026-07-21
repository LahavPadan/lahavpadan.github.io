# frozen_string_literal: true

require 'cgi'

module LahavBlog
  # Converts Obsidian-style callouts such as
  #
  #   > [!Info] Title
  #   >
  #   > Body
  #
  # into a real HTML aside whose contents are still parsed as Markdown.
  # Kramdown does not understand the [!Info] marker, and multi-line display
  # equations inside a blockquote are otherwise parsed badly.
  module ObsidianCallouts
    START = /^(\s*)>\s*\[!([A-Za-z0-9_-]+)\]\s*(.*)$/.freeze
    NESTED_START = /\A\[![A-Za-z0-9_-]+\]/.freeze

    def self.transform(content, math:)
      return content if content.nil? || !content.include?('[!')

      lines = content.lines(chomp: true)
      output = []
      index = 0

      while index < lines.length
        match = START.match(lines[index])

        unless match
          output << lines[index]
          index += 1
          next
        end

        indent = match[1]
        body, index = collect_body(lines, index + 1, indent)
        emit(output, indent, match[2], match[3].strip, body, math: math)
      end

      result = output.join("\n")
      content.end_with?("\n") ? "#{result}\n" : result
    end

    def self.collect_body(lines, index, indent)
      quoted_line = /\A#{Regexp.escape(indent)}>\s?(.*)\z/.freeze
      body = []

      while index < lines.length
        quoted = quoted_line.match(lines[index])

        if quoted
          # An adjacent callout starts its own block rather than being absorbed.
          break if NESTED_START.match?(quoted[1])

          body << quoted[1]
          index += 1
          next
        end

        # Tolerate an unquoted blank line when the same callout resumes below.
        break unless lines[index].strip.empty? && index + 1 < lines.length

        following = quoted_line.match(lines[index + 1])
        break if following.nil? || NESTED_START.match?(following[1])

        body << ''
        index += 1
      end

      [body, index]
    end
    private_class_method :collect_body

    def self.emit(output, indent, kind, title, body, math:)
      css_kind = kind.downcase.gsub(/[^a-z0-9_-]/, '-')
      label = kind.tr('_-', ' ').split.map(&:capitalize).join(' ')
      # The title becomes text inside a callout-title <div>, which Kramdown
      # treats as raw HTML block content and never scans for math. On math
      # pages, hand any `$…$` off to MathJax directly.
      title = MathSyntax.rewrite_to_mathjax_inline(title) if math
      heading = CGI.escapeHTML(title)
      heading = " #{heading}" unless heading.empty?

      output << '' unless output.empty? || output.last.empty?
      output << %(#{indent}<aside class="callout callout--#{css_kind}" markdown="1">)
      output << %(#{indent}<div class="callout__title"><span class="callout__kind">#{label}</span>#{heading}</div>)
      output << ''
      body.each { |line| output << "#{indent}#{line}" }
      output << '' unless output.last&.empty?
      output << %(#{indent}</aside>)
      output << ''
    end
    private_class_method :emit
  end

  # Reconciles the authored math conventions with the only one Kramdown has.
  #
  # Kramdown recognizes `$$…$$` and nothing else. An inline span written as
  # `$a_1 + b_2$` is therefore ordinary prose to it: the underscores pair into
  # emphasis, brackets become links, and pipes start tables. Rewriting the
  # delimiters into Kramdown's own hands the span to its math parser, which
  # leaves the interior alone and emits `\(…\)` for MathJax.
  #
  # Two adjustments survive that rewrite:
  #
  #   * A standalone `$$` needs blank lines around it, or Kramdown reads the
  #     equation as a paragraph rather than a block.
  #
  #   * `TABLE_START = /^#{OPT_SPACE}(\||[^\n]*?[^\\\n]\|)/` means any line
  #     holding an unescaped pipe begins a table, and the table parser runs
  #     before span math. `\vert{}` carries the same meaning past it. Block
  #     math needs no such help, because `block_math` is tried before `table`.
  #
  # Everything here is confined to documents that declare `math: true`. Posts
  # that do not are full of `$STANDARD_INFORMATION`, `$Extend\$UsnJrnl:$J` and
  # `$7.68 billion`, and a dollar sign there means a dollar sign.
  module MathSyntax
    FENCE = /\A(\s*)(`{3,}|~{3,})/.freeze
    DISPLAY_LINE = '$$'

    # Leftmost-match alternation: a dollar sign inside a code span is consumed
    # by the code branch, so it never reaches the math branches. An HTML
    # opening tag is similarly consumed by the html branch, whose attribute
    # values Kramdown will never expose to its math parser — so we emit
    # MathJax's own `\(…\)` delimiters there directly (via TAG_ATTR_MATH),
    # rather than Kramdown's `$$…$$` inline-math syntax which would arrive at
    # the browser as literal text.
    TOKEN = /
      (?<code> (?<tick>`+) .*? \k<tick> )
      |
      (?<html> < [a-zA-Z][^<>]* > )
      |
      (?<display> (?<!\\)\$\$ .+? (?<!\\)\$\$ )
      |
      (?<inline> (?<![\\$]) \$ (?!\$) (?:\\\$|[^$\n])+? (?<!\\) \$ (?!\$) )
    /mx.freeze

    # Same shape as the inline branch above, without the named group.
    TAG_ATTR_MATH =
      /(?<![\\$])\$(?!\$)((?:\\\$|[^$\n])+?)(?<!\\)\$(?!\$)/.freeze

    def self.normalize(content)
      return content if content.nil? || !content.include?('$')

      rewrite_outside_fences(content) do |prose|
        rewrite_math(pad_display_blocks(prose))
      end
    end

    # Fenced code is reproduced verbatim; everything else is handed to the
    # block for rewriting.
    def self.rewrite_outside_fences(content)
      output = []
      prose = []
      fence = nil

      content.lines(chomp: true).each do |line|
        match = FENCE.match(line)

        if fence.nil? && match
          output << yield(prose.join("\n")) unless prose.empty?
          prose = []
          fence = match[2]
          output << line
        elsif fence
          output << line
          fence = nil if match && match[2].start_with?(fence)
        else
          prose << line
        end
      end

      output << yield(prose.join("\n")) unless prose.empty?
      result = output.join("\n")
      content.end_with?("\n") ? "#{result}\n" : result
    end
    private_class_method :rewrite_outside_fences

    def self.pad_display_blocks(prose)
      lines = prose.lines(chomp: true)
      output = []
      open = false

      lines.each_with_index do |line, index|
        unless line.strip == DISPLAY_LINE
          output << line
          next
        end

        if open
          output << line
          following = lines[index + 1]
          output << '' if following && !following.strip.empty?
        else
          output << '' unless output.empty? || output.last.empty?
          output << line
        end

        open = !open
      end

      output.join("\n")
    end
    private_class_method :pad_display_blocks

    def self.rewrite_math(prose)
      prose.gsub(TOKEN) do
        match = Regexp.last_match

        if match[:code]
          match[:code]
        elsif match[:html]
          rewrite_to_mathjax_inline(match[:html])
        elsif match[:display]
          body = match[:display][2..-3]
          multiline?(match[:display]) ? "$$#{body}$$" : "$$#{escape_pipes(body)}$$"
        else
          "$$#{escape_pipes(match[:inline][1..-2])}$$"
        end
      end
    end
    private_class_method :rewrite_math

    # Rewrites `$…$` spans to MathJax's inline delimiters. Used from contexts
    # that Kramdown will not parse as markdown — HTML attribute values, and
    # inline text inside HTML block elements the callout emitter constructs.
    def self.rewrite_to_mathjax_inline(text)
      text.gsub(TAG_ATTR_MATH) { "\\(#{Regexp.last_match(1)}\\)" }
    end

    # A `$$…$$` that spans lines has already been given its own block by
    # pad_display_blocks, so Kramdown reaches it through `block_math`.
    def self.multiline?(region)
      region.include?("\n")
    end
    private_class_method :multiline?

    def self.escape_pipes(tex)
      tex.gsub(/(?<!\\)\|/) { '\\vert{}' }
    end
    private_class_method :escape_pipes
  end

  module MarkdownPreprocessor
    def self.process(content, math:)
      return content if content.nil?

      content = ObsidianCallouts.transform(content, math: math)
      math ? MathSyntax.normalize(content) : content
    end
  end
end

if defined?(Jekyll) && defined?(Liquid)
  %i[documents pages].each do |scope|
    Jekyll::Hooks.register(scope, :pre_render) do |item|
      item.content = LahavBlog::MarkdownPreprocessor.process(
        item.content, math: item.data['math']
      )
    end
  end

  # include_relative is expanded while Liquid renders, long after :pre_render,
  # so an article body pulled in that way has to be processed as it is read.
  # The including page owns the front matter, and therefore the math flag.
  module Jekyll
    module Tags
      class PreprocessedIncludeRelativeTag < IncludeRelativeTag
        def read_file(file, context)
          page = context.registers[:page]
          LahavBlog::MarkdownPreprocessor.process(
            super, math: page && page['math']
          )
        end
      end
    end
  end

  Liquid::Template.register_tag(
    'include_relative',
    Jekyll::Tags::PreprocessedIncludeRelativeTag
  )
end