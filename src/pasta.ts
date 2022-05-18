import * as Discord from "discord.js";
import { strict as assert } from "assert";
import { M } from "./utils";
import { colors, is_authorized_admin, TCCPP_ID } from "./common";

let client: Discord.Client;

function on_interaction_create(interaction: Discord.Interaction) {
    if (!interaction.isCommand()) return;
    console.log(interaction);
}

export async function setup_pasta(_client: Discord.Client) {
    client = _client;
    client.on("interactionCreate", on_interaction_create);
}
