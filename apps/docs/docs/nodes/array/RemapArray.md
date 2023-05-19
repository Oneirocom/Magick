# Remap Array

Takes an input array and iterates through each object in the the array, creates a new object with only the matching keys from the Values property, and outputs an array of the new objects.

For example, given this input array of objects:

`[{"URL": "https://magick.com/", "Title": "Magick"}, {"URL": "https://www.foo.bar/", "Title": "Foo Bar"}]`

and a Values property "URL" it will return an array of objects with only the URL key:

`[{"URL": "https://magick.com/"}, {"URL": "https://www.foo.bar/"}]`
