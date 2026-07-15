# frozen_string_literal: true

require 'kramdown'

# Kramdown's stock `mathjax` math engine emits a block equation as bare text:
#
#   result = el.options[:category] == :block ? "\\[#{value}\\]\n" : "\\(#{value}\\)"
#   if el.attr.empty?
#     result                    # <- no element, just a text node
#
# A block equation therefore reaches the browser as a text node with no parent
# of its own. Anything that walks `element.children`, `nextElementSibling` or
# `previousElementSibling` skips it, and anything that moves surrounding
# elements silently leaves it behind. CSS cannot address it either, since it
# has no element to select until MathJax replaces it.
#
# This engine keeps kramdown's delimiters and only supplies the missing
# element, so a block equation is an addressable node from the moment the page
# is built rather than from the moment MathJax finishes typesetting.
module Kramdown
  module Converter
    module MathEngine
      module MathjaxBlock
        CLASS_NAME = 'math-block'

        def self.call(converter, element, opts)
          value = converter.escape_html(element.value)
          return "\\(#{value}\\)" unless element.options[:category] == :block

          attr = element.attr.dup
          attr['class'] = [attr['class'], CLASS_NAME].compact.join(' ').strip
          converter.format_as_block_html('div', attr, "\\[#{value}\\]", opts[:indent])
        end
      end
    end
  end
end

Kramdown::Converter.add_math_engine(
  :mathjax_block,
  Kramdown::Converter::MathEngine::MathjaxBlock
)
