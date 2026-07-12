# frozen_string_literal: true

require 'cgi'

# Converts Obsidian-style callouts such as
#
#   > [!Info] Title
#   >
#   > Body
#
# into a real HTML aside whose contents are still parsed as Markdown. This is
# necessary because Kramdown does not understand the [!Info] marker, and
# multi-line display equations inside blockquotes are otherwise parsed badly.
module ObsidianCallouts
  START = /^(\s*)>\s*\[!([A-Za-z0-9_-]+)\]\s*(.*)$/

  def self.transform(content)
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
      raw_kind = match[2]
      title = match[3].strip
      body = []
      index += 1

      quote_line = /\A#{Regexp.escape(indent)}>\s?(.*)\z/

      while index < lines.length
        quoted = quote_line.match(lines[index])

        if quoted
          # A second callout begins a new block; do not absorb it into the
          # current callout when two callouts are adjacent.
          break if quoted[1].match?(/\A\[![A-Za-z0-9_-]+\]/)

          body << quoted[1]
          index += 1
          next
        end

        # Tolerate an unquoted empty line when the same callout continues on
        # the next quoted line. A quoted [!Type] marker starts a new callout.
        if lines[index].strip.empty? && index + 1 < lines.length
          following_quote = quote_line.match(lines[index + 1])
          if following_quote && !following_quote[1].match?(/\A\[![A-Za-z0-9_-]+\]/)
            body << ''
            index += 1
            next
          end
        end

        break
      end

      css_kind = raw_kind.downcase.gsub(/[^a-z0-9_-]/, '-')
      label = raw_kind.tr('_-', ' ').split.map(&:capitalize).join(' ')
      escaped_title = CGI.escapeHTML(title)

      output << '' unless output.empty? || output.last.empty?
      output << %(#{indent}<aside class="callout callout--#{css_kind}" markdown="1">)
      output << %(#{indent}<div class="callout__title"><span class="callout__kind">#{label}</span>#{escaped_title.empty? ? '' : " #{escaped_title}"}</div>)
      output << ''
      body.each { |line| output << "#{indent}#{line}" }
      output << '' unless output.last&.empty?
      output << %(#{indent}</aside>)
      output << ''
    end

    result = output.join("\n")
    content.end_with?("\n") ? "#{result}\n" : result
  end
end

# Kramdown only recognizes a display-math block reliably when the $$ delimiter
# is separated from surrounding prose by blank lines. Normalize those
# boundaries before Markdown parsing.
module DisplayMathBlocks
  def self.normalize(content)
    return content if content.nil? || !content.include?('$$')

    lines = content.lines(chomp: true)
    output = []
    in_display = false

    lines.each_with_index do |line, index|
      if line.strip == '$$'
        if in_display
          output << line
          in_display = false

          following = lines[index + 1]
          output << '' if following && !following.strip.empty?
        else
          output << '' unless output.empty? || output.last.empty?
          output << line
          in_display = true
        end
      else
        output << line
      end
    end

    result = output.join("\n")
    content.end_with?("\n") ? "#{result}\n" : result
  end
end

module ProtectMath
  # $$...$$ blocks, including expressions spanning multiple lines.
  DISPLAY_MATH = /
    (?<!\\)
    \$\$
    (.+?)
    (?<!\\)
    \$\$
  /mx.freeze

  # $...$ spans, excluding $$...$$ blocks.
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

  # A literal | inside TeX can be mistaken for a Markdown table separator.
  # \vert{} has the same mathematical meaning but is safe for Kramdown.
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

module MarkdownPreprocessor
  def self.process(content)
    return content if content.nil?

    content = content.dup
    if [Encoding::ASCII_8BIT, Encoding::US_ASCII].include?(content.encoding)
      content.force_encoding(Encoding::UTF_8)
    end

    content = ObsidianCallouts.transform(content)
    content = DisplayMathBlocks.normalize(content)
    ProtectMath.protect(content)
  end
end

if defined?(Jekyll) && defined?(Liquid)
  Jekyll::Hooks.register :documents, :pre_render do |document|
    document.content = MarkdownPreprocessor.process(document.content)
  end

  Jekyll::Hooks.register :pages, :pre_render do |page|
    page.content = MarkdownPreprocessor.process(page.content)
  end

  # include_relative is expanded before Kramdown runs, so process included
  # Markdown at the point where Jekyll reads it.
  module Jekyll
    module Tags
      class ProcessedIncludeRelativeTag < IncludeRelativeTag
        def read_file(file, context)
          MarkdownPreprocessor.process(super)
        end
      end
    end
  end

  Liquid::Template.register_tag(
    'include_relative',
    Jekyll::Tags::ProcessedIncludeRelativeTag
  )
end
