# Together C & C++ Wiki, aka. Howto Articles

These wiki articles were contributed by member of the Together C & C++ discord server.

## How to Contribute

Make a PR either adding or modifying a `.md` file in this folder, or submit an
issue about an article.

## Wiki Markdown

The articles are written in a GitHub-flavored Markdown.
Generally, what you see as a GitHub preview is what you should be getting in the
output embed, more or less.
However, there are some extra nuances:

### General Style

1. The articles should be written in a neutral American English.
2. Avoid contractions such as "don't".
3. Avoid colloquialisms such as "member variable";
   instead use standard terminology like "data member".
4. Keep yourself *extremely* concise.
   There isn't much space in a Discord embed, and even adding one line to it
   has major consequences.

The Markdown source should fit into an 80-column limit when possible
(sometimes it isn't, such as for long links).
Remember that there isn't much horizontal space in an embed.

### Article Title

```md
# Title
```
A level 1 heading turns into the title of the embed.
This will also be used to look up the article in the `/wiki` or `/howto` command.

There can be only one level 1 heading in the article, and because it is the
title embed, it will always be displayed at the top of the embed, regardless
of where the title is located in your markdown.

Use Wikipedia-style title case for all headings.
If you're unsure about capitalization, use
[Title Case Converter](https://titlecaseconverter.com/) and select `Wikipedia`.

### (Inline) Fields
```md
<!-- inline -->
## Field
```
Any level 2 heading turns into an embed field.
Adding an HTML comment with `inline` will make it an *inline field*, which means
that it is displayed side-by-side with other inline fields.

Almost all Markdown formatting is supported in fields, but not in field titles.

### Description
Everything after the title, and before the first field is the so-called
description of the embed.
You can think of it as the "text body".
This section is displayed above all fields.

Almost all Markdown formatting is supported in the description.

### Footers
```md
<!-- footer -->
Footer here.
```
Everything after a `footer` HTML comment will turn into the footer of the embed.
This is a part of the embed at the bottom, displayed with small font.

There are some Markdown restrictions in footers; for example, you cannot use
masked links.

### Image
```md
<!-- image https://xyz.xyz/image.png -->
```
Any embed can contain up to one image.
This image is displayed at the bottom of the embed, after any fields.

Only include images when they're essential to the article, such as the
infographic in [our article on special members](special_members.md).

### User Authors
```md
<!-- user author -->
```
Adding this HTML comment anywhere makes it so that the user who sent the
`/howto` command becomes the "embed author".
Their name and avatar will be displayed in the embed.

Most articles should not have this, only articles that directly address another
user instead of providing general information.
For example, [our article reminding people not to use cheats](cheats.md) uses
this feature.

### Aliases
```md
<!-- alias x, y, z -->
```
This comma-separated list of aliases in an HTML comment will create commands
that can be used to display the article, in addition to `/wiki`.
The names of the aliases become the name of the commands.

### Whitespace and Line Breaks

Just like on GitHub, you can split a paragraph's text over multiple source
lines.
You can add `<br>` anywhere to insert a line break, and you can
split paragraphs by inserting at least one blank line between them.

Unordered lists (starting with `- `), ordered lists (starting with `1.`), and
code blocks (starting with \`\`\`) are treated specially, and don't get merged
onto the same line.

### Emotes

```md
:fire:
<:stackoverflow:1074747016644661258>
```
Global Discord emotes like `:fire:` can be used directly and will display in the
embed like they do in your messages.
For server-specific emotes, use the format above.

The same applies to channel mentions, role mentions, etc.
You can use the app command `Apps > Inspect` on TCCPP to see how emotes,
channel mentions, and other things are formatted, and then copy/paste this
into the markdown of your article.

### Code Blocks

You can include code blocks in the article using:
> \`\`\`lang<br>
> // code here ...<br>
> \`\`\`

Substitute `lang` with a language of choice to enable syntax highlighting.
Use `cpp` for C++, and `c` for C.

There is no uniform code style, and you'll sometimes have to compromise on
style because you have around ~50 columns, and even fewer when you use fields
to display code side-by-side.
However, there are a few rules and guidelines:

#### C/C++ Code Style (Always follow)

- name and capitalize symbols like in the C++ standard
  - `PascalCase` for template parameters
  - `UPPER_SNAKE_CASE` for macros
  - `lower_snake_case` for everything else
- in template headers, use `class` instead of `typename`
- don't use list initialization purely for stylistic reasons,
  - i.e. use `int x = 0;` instead of `int x{ 0 };`
  - `return {};` is fine for class types, but not fundamental types
- don't use `auto` variables purely for stylistic reasons
  - remember that these are educational resources, they may not know what the
    type is
  - `auto` variables are fine to avoid repetition,
    e.g. `auto x = static_cast...`

#### Formatting Rules (Always follow)

- don't waste space by using Allman brace style, use K&R
- use spaces for indentation, not tabs

#### Formatting Guidelines (Ignore for aesthetics)

- format template headers as `template <class T>`,
  and put them on a separate line
- surround operators with spaces, like `x + y`
- use spaces in list initialization, like `T t{ 1, 2, 3 };`
- don't use spaces inside parentheses, e.g. `std::min(0 ,1)`
- separate `if`, `while`, etc. from the condition with parentheses
- use four spaces for indentation

All of these guidelines can be ignored if it avoids breaking lines, or provides
much better aesthetics in some particular case.

### Links

Articles should not contain plain URLs such as `https://google.com`, only
masked links such as `[Google](https://google.com)`.
Embeds on Discord are extremely limited in space, and full URLs take up too
much of it.

Whenever a standard library symbol is mentioned, create a masked link to the
relevant cppreference article.
For example: `**[std::endl](https://en.cppreference.com/w/cpp/io/manip/endl)**`.
Such symbols should be **bold*** links.

When using terms that the reader might not be familiar with yet, link to
Wikipedia, the C++ standard, or another source which provides a definition.
For example: `*[variable-length array](https://en.wikipedia.org/wiki/Variable-length_array)*`.
Such terms should be *italic* links.

Prefer Markdown formatting *outside* the link, because Discord's support on
mobile devices for Markdown is incomplete, and some features may not work
inside of links.

### *See Also* Section

If there are sources which haven't been linked to in the rest of the embed,
and which are relevant to the topic, add a **See Also** field with an
unordered list of links.
Use masked links, but prefix them in a way that makes it obvious what page
is being linked to.
This may be done by adding an emote, in which case the emote replaces the
bullet point.

For inter-article references, add an inline code snippet with the command
to post the article, i.e. `!wiki ...`.
Use `!wiki`, not `!howto` because it is the canonical command.

#### Example

```md
## See Also
<:stackoverflow:1074747016644661258>
[What's the point of VLA anyway](https://stackoverflow.com/q/22530363/5740428)
- [Wikipedia article on Variable-length arrays](https://en.wikipedia.org/wiki/Variable-length_array)
- [cppreference: Array declaration](https://en.cppreference.com/w/cpp/language/array)
- `!wiki vla`
```

## Previewing Wiki Articles

To test out a wiki article use `!wiki-preview <entire article content>` on the server.
