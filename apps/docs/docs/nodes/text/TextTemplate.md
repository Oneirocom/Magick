# Text Template

Takes any number of named inputs and inserts them into a template defined in the text editor, then outputs the resulting string. The template you create must follow a templating language known as Handlebars. Any value which is wrapped like \{\{this\}\} in double braces will be replaced with the corresponding value from the input with the same name. This allows you to write almost any fewshot you might need, and input values from anywhere else in your graph.
