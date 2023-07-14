import { strict as assert } from "assert";

import * as Discord from "discord.js";
import * as fs from "fs";
import * as path from "path";

import { M } from "../utils.js";
import { bot_spam_id, colors } from "../common.js";
import { BotComponent } from "../bot-component.js";
import { Wheatley } from "../wheatley.js";
import { TextBasedCommand, TextBasedCommandBuilder } from "../command.js";

export const wiki_dir = "wiki_articles";

async function* walk_dir(dir: string): AsyncGenerator<string> { // todo: duplicate
    for(const f of await fs.promises.readdir(dir)) {
        const file_path = path.join(dir, f).replace(/\\/g, "/");
        if((await fs.promises.stat(file_path)).isDirectory()) {
            yield* walk_dir(file_path);
        } else {
            yield file_path;
        }
    }
}

type WikiArticle = {
    title: string;
    body?: string;
    fields: WikiField[],
    footer?: string;
    set_author: boolean;
    no_embed: boolean;
};

type WikiField = {
    name: string;
    value: string;
    inline: boolean;
}

enum parse_state { body, field, footer, before_title, before_field, done }

/**
 * One-time use class for parsing articles.
 */
class ArticleParser {
    private readonly _article_aliases = new Set<string>()

    private _title: string;
    private _body?: string
    private _fields: WikiField[] = []
    private _footer?: string;
    private _set_author?: true;
    private _no_embed?: true;

    private _current_state = parse_state.body
    private _in_code = false;

    parse(content: string) {
        this._body = ""
        for(const line of content.split(/\r?\n/)) {
            this.parse_line(line);
        }
        assert(!this._in_code, "Unclosed code block in wiki article");
        assert(this._current_state !== parse_state.before_title, "Trailing title directive");
        assert(this._current_state !== parse_state.before_field, "Trailing (inline) field directive");

        this._body = this._body.trim();
        if(this._body === "") {
            this._body = undefined;
        }

        // title will just be for search purposes in no embed mode
        assert(this._title, "Wiki article must have a title");

        this._footer = this._footer?.trim();
        assert(this._fields); // will always be true

        if(this._no_embed) {
            assert(this._body, "Must have a body if it's not an embed");
            assert(!this._footer, "Can't have a footer if it's not an embed");
            assert(this._fields.length == 0, "Can't have fields if it's not an embed");
        }

        this._current_state = parse_state.done;
    }

    parse_line(line: string): void {
        const trimmed = line.trim();
        if(trimmed.startsWith("```")) {
            this._in_code = !this._in_code;
            this.parse_regular_line(line);
        } else if(!this._in_code && line.startsWith("#")) {
            this.parse_heading(line);
        } else if(!this._in_code && trimmed.startsWith("<!--") && trimmed.endsWith("-->")) {
            const directive = trimmed.match(/^<!--+(.*?)-+->$/)![1].trim();
            this.parse_directive(directive);
        } else {
            this.parse_regular_line(line);
        }
    }

    /**
     * Parses one line, starting with #.
     * @param line the line
     */
    parse_heading(line: string): void {
        const level = line.search(/[^#]/);
        assert(level >= 1, "Cannot parse heading that has no heading level");

        if(this._current_state === parse_state.before_title) {
            assert(level === 1, "Title must be heading level 1");
            this._title = line.substring(1).trim();
            this._current_state = parse_state.body;
        } else if(this._current_state === parse_state.before_field) {
            assert(level === 2, "Field title must be heading level 2");
            this._fields[this._fields.length - 1].name = line.substring(2).trim();
            this._current_state = parse_state.field;
            return;
        } else {
            this.parse_regular_line(line);
        }
    }

    /**
     * Parses a directive. Directives are HTML comments in Markdown with special meaning.
     * This function accepts the contents of such a comment, without the opening `<!--` and closing `-->`.
     * @param directive the directive to parse
     */
    parse_directive(directive: string): void {
        if(directive === "title") {
            assert(this._current_state === parse_state.body, "Title directive can only appear in body");
            this._current_state = parse_state.before_title;
        } else if(directive === "field") {
            this._fields.push({name: '', value: '', inline: false});
            this._current_state = parse_state.before_field;
        } else if(directive === "inline field") {
            this._fields.push({name: '', value: '', inline: true});
            this._current_state = parse_state.before_field;
        } else if(directive === "footer") {
            this._current_state = parse_state.footer;
        } else if(directive === "user author") {
            this._set_author = true;
        } else if(directive === "no embed") {
            this._no_embed = true;
        } else if(directive.startsWith("alias ")) {
            const aliases = directive
                .substring("alias ".length)
                .split(",")
                .map(alias => alias.trim());
            for(const alias of aliases) {
                assert(!this._article_aliases.has(alias));
                this._article_aliases.add(alias);
            }
        }
    }

    parse_regular_line(line: string): void {
        const requires_line_break = this._in_code ||
            line.startsWith("#") ||
            line.endsWith("  ") ||
            line.trim() === "" ||
            line.trim().startsWith("- ") ||
            line.trim().match(/^\d+.*$/);
        const terminated_line = requires_line_break ? line + "\n" : line;

        if(this._current_state === parse_state.body) {
            this._body += (this._body!.endsWith(" ") ? "" : " ") + terminated_line;
        } else if(this._current_state === parse_state.field) {
            this._fields[this._fields.length - 1].value +=
                (this._fields[this._fields.length - 1].value.endsWith(" ") ? "" : " ") + terminated_line;
        } else if(this._current_state === parse_state.footer) {
            this._footer = this._footer ?? "";
            this._footer += (this._footer.endsWith(" ") ? "" : " ") + terminated_line;
        } else {
            assert(false);
        }
    }

    get is_done(): boolean {
        return this._current_state === parse_state.done;
    }

    get article(): WikiArticle {
        assert(this.is_done, "Attempting to access article of a parser without success");
        return {
            title: this._title,
            body: this._body,
            fields: this._fields,
            footer: this._footer,
            set_author: this._set_author ?? false,
            no_embed: this._no_embed ?? false,
        };
    }

    get article_aliases(): Set<string> {
        assert(this.is_done, "Attempting to access aliases of a parser without success");
        return this._article_aliases;
    }

}

export function parse_article(content: string): [WikiArticle, Set<string>] {
    const parser = new ArticleParser();
    parser.parse(content);
    return [parser.article, parser.article_aliases];
}

/**
 * Parses wiki articles and adds the /wiki or /howto command for displaying them.
 *
 * Freestanding.
 */
export class Wiki extends BotComponent {
    articles: Record<string, WikiArticle> = {};
    article_aliases: Map<string, string> = new Map();

    constructor(wheatley: Wheatley) {
        super(wheatley);

        this.add_command(
            new TextBasedCommandBuilder([ "wiki", "howto" ])
                .set_description([ "Retrieve wiki articles", "Retrieve wiki articles (alternatively /wiki)" ])
                .add_string_option({
                    title: "query",
                    description: "Query",
                    required: true,
                    autocomplete: query => Object.values(this.articles)
                        .map(article => article.title)
                        .filter(title => title.toLowerCase().includes(query))
                        .map(title => ({ name: title, value: title }))
                        .slice(0, 25)
                })
                .set_handler(this.wiki.bind(this))
        );

        this.add_command(
            new TextBasedCommandBuilder("wiki-preview")
                .set_slash(false)
                .set_description("Preview a wiki article")
                .add_string_option({
                    title: "content",
                    description: "Content",
                    required: true
                })
                .set_handler(this.wiki_preview.bind(this))
        );
    }

    override async setup() {
        await this.load_wiki_pages();
        // setup slash commands for aliases
        for(const [ alias, article_name ] of this.article_aliases.entries()) {
            const article = this.articles[article_name];
            this.add_command(
                new TextBasedCommandBuilder(alias)
                    .set_description(article.title)
                    .set_handler(this.wiki_alias.bind(this))
            );
        }
    }

    async load_wiki_pages() {
        for await(const file_path of walk_dir(wiki_dir)) {
            const name = path.basename(file_path, path.extname(file_path));
            //M.debug(file_path, name);
            if(name == "README") {
                continue;
            }
            const content = await fs.promises.readFile(file_path, { encoding: "utf-8" });
            const [ article, aliases ] = parse_article(content);
            this.articles[name] = article;
            for(const alias of aliases) {
                this.article_aliases.set(name, alias);
            }
        }
    }

    async send_wiki_article(article: WikiArticle, command: TextBasedCommand) {
        if(article.no_embed) {
            assert(article.body);
            await command.reply({
                content: article.body,
                should_text_reply: true
            });
        } else {
            const embed = new Discord.EmbedBuilder()
                .setColor(colors.color)
                .setTitle(article.title)
                .setDescription(article.body ?? null)
                .setFields(article.fields);
            if(article.set_author) {
                const member = await command.get_member();
                embed.setAuthor({
                    name: member.displayName,
                    iconURL: member.avatarURL() ?? command.user.displayAvatarURL()
                });
            }
            if(article.footer) {
                embed.setFooter({
                    text: article.footer
                });
            }
            await command.reply({
                embeds: [embed],
                should_text_reply: true
            });
        }
    }

    async wiki(command: TextBasedCommand, query: string) {
        M.debug('displaying wiki'); // FIXME remove

        const matching_articles = Object
            .entries(this.articles)
            .filter(([ name, { title }]) => name == query.replaceAll("-", "_") || title == query)
            .map(([ _, article ]) => article);
        const article = matching_articles.length > 0 ? matching_articles[0] : undefined;
        M.log(`Received !wiki command for ${article}`);
        if(article) {
            await this.send_wiki_article(article, command);
        } else {
            await command.reply("Couldn't find article", true, true);
            return;
        }
    }

    async wiki_alias(command: TextBasedCommand) {
        assert(this.article_aliases.has(command.name));
        M.log(`Received ${command.name} (wiki alias)`, command.user.id, command.user.tag, command.get_or_forge_url());
        const article_name = this.article_aliases.get(command.name)!;
        await this.send_wiki_article(this.articles[article_name], command);
    }

    async wiki_preview(command: TextBasedCommand, content: string) {
        M.log("Received wiki preview command", command.user.id, command.user.tag, command.get_or_forge_url());
        if(!this.wheatley.freestanding && command.channel_id !== bot_spam_id) {
            await command.reply(`!wiki-preview must be used in <#${bot_spam_id}>`, true, true);
            return;
        }
        let article: WikiArticle;
        try {
            article = parse_article(content)[0];
        } catch(e) {
            await command.reply("Parse error: " + e, true, true);
            return;
        }
        try {
            await this.send_wiki_article(article, command);
        } catch(e) {
            await command.reply("Error while building / sending: " + e, true, true);
        }
    }
}