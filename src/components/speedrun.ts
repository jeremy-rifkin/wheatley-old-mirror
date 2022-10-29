import * as Discord from "discord.js";
import { strict as assert } from "assert";
import { critical_error, diff_to_human, fetch_text_channel, M } from "../utility/utils";
import { MemberTracker } from "../infra/member_tracker";
import { action_log_channel_id, colors } from "../common";

let tracker: MemberTracker;
let client: Discord.Client;
let action_log_channel: Discord.TextChannel;

function on_ban(ban: Discord.GuildBan, now: number) {
    try {
        M.debug("speedrun check");
        const user = ban.user;
        // get user info
        const avatar = user.displayAvatarURL();
        if(!tracker.id_map.has(user.id)) {
            return; // If not in tracker, been in the server longer than 30 minutes
        }
        const entry = tracker.id_map.get(user.id)!;
        if(entry.purged) {
            return; // ignore bans from !raidpurge
        }
        if(entry.joined_at == 0) {
            // ignore pseudo entries from anti-scambot, pseudo entries added when the user isn't in
            // the tracker already (i.e. longer than 30 minutes, not a speedrun)
            return;
        }
        // .purged set by raidpurge (yes I know it's checked above), currently_banning used by anti-scambot
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        const is_auto_ban = entry.purged || tracker.currently_banning.has(user.id);
        // make embed
        const embed = new Discord.EmbedBuilder()
            .setColor(colors.speedrun_color)
            .setAuthor({
                name: `Speedrun attempt: ${user.tag}`,
                iconURL: avatar
            })
            .setDescription(`User <@${user.id}> joined at <t:${Math.round(entry.joined_at / 1000)}:T> and`
                          + ` banned at <t:${Math.round(now / 1000)}:T>.\n`
                          + `Final timer: ${diff_to_human(now - entry.joined_at)}.`
                          + (is_auto_ban ? "\n**AUTO BAN**" : ""))
            .setFooter({
                text: `ID: ${user.id}`
            })
            .setTimestamp();
        action_log_channel!.send({ embeds: [embed] });
    } catch(e) {
        critical_error(e);
    }
}

export async function setup_speedrun(_client: Discord.Client, _tracker: MemberTracker) {
    client = _client;
    tracker = _tracker;
    M.debug("Setting up speedrun");
    client.on("ready", async () => {
        try {
            action_log_channel = await fetch_text_channel(action_log_channel_id);
            M.debug("tracked_mentions: action_log_channel channel fetched");
            tracker.add_submodule({ on_ban });
        } catch(e) {
            critical_error(e);
        }
    });
}