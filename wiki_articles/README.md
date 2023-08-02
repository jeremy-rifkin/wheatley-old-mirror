# Together C & C++ Wiki, aka. Howto Articles

These wiki articles have been contributed by members of the
[Together C & C++](https://discord.com/servers/together-c-c-331718482485837825)
Discord server.

## Scope and Philosophy

The goal of the articles is to simplify helping programmers on Discord.
Wiki articles solve many problems:
1. We all make mistakes, even the experts among us.
   Community-curated resources are much more reliable than the answers we can
   give on the fly.
2. Answering questions involves a lot of effort sometimes, such as gathering
   links, writing up sample code, etc.
   Community resources can reduce this effort.
3. The full answer is often found online, on a reference page, in some article,
   in an infographic etc.
   However, simply linking to these resources takes people out of the
   conversation completely.
   Wiki articles get displayed as embeds on Discord, so they are much less
   disruptive.
4. Dumping links on people with no explanation can be seen as lazy or
   hostile, even when there were nothing but good intentions.
   Wiki articles provide a number of links *and* a brief explanation.

### What Should Be in the Wiki

The articles focus mostly on C/C++ specific topics such as
[iterators](iterators.md), [type syntax](cdecl.md),
[smart pointers](smart_ptr.md), etc.
However, they also involve broader subjects such as
[what IDE to choose](ide.md),
[why you should format your code](formatting.md),
[how recursion works](recursion.md), etc.
There are even Discord-specific articles which tell people how to
[format code on Discord](code.md).

Generally, anything that is commonly helpful to programmers on Discord belongs
here.

### What Should Not Be in the Wiki

The articles have to be on at least somewhat common topics.
Domain- or framework-specific problems like "How to Use Signals in Qt" do not
belong here.

### Editorialization

We do not host opinion pieces such as "Why C++ Is Better than C".
However, we do editorialize our articles by making explicit recommendations
for/against technologies and idioms.
For example, in [our article on code formatting](formatting.md), we make the
recommendation not to use exotic styles, and to use auto-formatters.

There should always be good rationale for editorialization, though it's not
required to justify advice in the article itself.
For example, [we recommend not to use single-character variables](naming.md) but
explaining why would needlessly bloat the article.
There is always a user who is posting the article on Discord,
and they should be able to justify such things.

---

## How to Contribute

Make a pull request either adding or modifying a `.md` file in this folder,
or submit an issue about an article.

### Previewing Wiki Articles

To test out a wiki article, use `!wiki-preview <entire article content>`
on the server.

---

## Wiki Markdown

The articles are written in a GitHub-flavored Markdown.
Generally, what you see as a GitHub preview is what you should be getting in the
output embed, more or less.
However, there are some extra nuances:

### Article Title

```md
# Title
```
A level 1 heading turns into the title of the embed.
This will also be used to look up the article in the `/wiki` or `/howto`
command.

There can be only one level 1 heading in the article, and because it is the
title embed, it will always be displayed at the top of the embed, regardless
of where the title is located in your markdown.

### (Inline) Fields
```md
<!-- inline -->
## Field
```
Any level 2 heading turns into an embed field.
Adding an HTML comment with `inline` will make it an *inline field*, which means
that it is displayed side-by-side with other inline fields.

### Description
Everything after the title, and before the first field is the so-called
description of the embed.
You can think of it as the "text body".
This section is displayed above all fields.

### Footers
```md
<!-- footer -->
Footer here.
```
Everything after a `footer` HTML comment will turn into the footer of the embed.
This is a part of the embed at the bottom, displayed with small font.

### Image
```md
<!-- image https://xyz.xyz/image.png -->
```
Any embed can contain exactly one image.
This image is displayed at the bottom of the embed, after any fields.

### User Authors
```md
<!-- user author -->
```
Adding this HTML comment anywhere makes it so that the user who sent the
`/howto` command becomes the "embed author".
Their name and avatar will be displayed in the embed.

### Aliases
```md
<!-- alias x, y, z -->
```
This comma-separated list of aliases in an HTML comment will create commands
that can be used to display the article, in addition to `/howto`.
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
