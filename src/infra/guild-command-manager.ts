import { REST } from "@discordjs/rest";
import { Routes } from "discord.js";

import * as util from "util";

import { critical_error, M } from "../utils.js";
import { TCCPP_ID } from "../common.js";
import { Wheatley } from "../wheatley.js";

export class GuildCommandManager {
    commands: any = [];
    finalized = false;
    constructor(readonly wheatley: Wheatley) {}
    register(builder: any) {
        if(this.finalized) {
            throw Error("Commands registered too late");
        }
        this.commands.push(builder);
    }
    async finalize(token: string) {
        try {
            this.finalized = true;
            const rest = new REST({ version: "10" }).setToken(token);
            if (!this.wheatley.freestanding) {
                M.log("Sending application commands");
                await rest.put(
                    Routes.applicationCommands(this.wheatley.id),
                    { body: this.commands },
                );
                // Clear any previous guild commands
                await rest.put(
                    Routes.applicationGuildCommands(this.wheatley.id, this.wheatley.guildId),
                    { body: [] },
                );
            }
            else {
                M.log("Sending application guild commands");
                // Clear any previous global commands
                await rest.put(
                    Routes.applicationCommands(this.wheatley.id),
                    { body: [] },
                );
                // use guild-specific commands in freestanding mode
                await rest.put(
                    Routes.applicationGuildCommands(this.wheatley.id, this.wheatley.guildId),
                    { body: this.commands },
                );
            }
            M.log("Finished sending commands");
        } catch(e) {
            M.log(util.inspect({ body: this.commands }, { showHidden: false, depth: null, colors: true }));
            critical_error(e);
        }
    }
}
