# frozen_string_literal: true

require 'kramdown'

# Kramdown's stock `mathjax` math engine emits a block equation as bare text:
#
#   result = el.options[:category] == :block ? "\\[#{value}\\]\n" : "\\(#{value}\\)"
#   if el.attr.empty?
#     result                    # <- no element, just a text node
#
# Since an authored equation carries no IAL, every block equation reaches the
# browser as a text node with no parent of its own. Anything that walks
# `children`, `nextElementSibling` or `previousElementSibling` skips it, and
# anything that regroups the surrounding elements leaves it behind. CSS cannot
# address it either, because there is no element to select until MathJax
# finishes typesetting.
#
# This engine keeps kramdown's delimiters and supplies the missing element, so
# a block equation is addressable from the moment the page is built.
#
# It replaces `:mathjax` rather than registering under a new name. Jekyll
# resolves any math engine other than `mathjax` as a gem
# (`kramdown-math-#{engine}`, see Jekyll::Converters::Markdown::KramdownParser),
# so a new name would demand a gem that does not exist. Replacing the entry
# also keeps one engine name for one behaviour.
module LahavBlog
  module BlockWrappedMathjax
    BLOCK_CLASS = 'math-block'

    def self.call(converter, element, opts)
      value = converter.escape_html(element.value)
      return "\\(#{value}\\)" unless element.options[:category] == :block

      attr = element.attr.dup
      attr['class'] = [attr['class'], BLOCK_CLASS].compact.join(' ').strip
      converter.format_as_block_html('div', attr, "\\[#{value}\\]", opts[:indent])
    end
  end
end

# `require 'kramdown'` loads kramdown/converter, which registers the stock
# `:mathjax` entry, so this replaces it rather than racing it.
Kramdown::Converter.add_math_engine(:mathjax, LahavBlog::BlockWrappedMathjax)
