import type { SlashCommandContext, TextCommandContext } from 'necord';
import { Client } from 'discord.js';
import { ShowDto } from './../dto/show.dto';
export declare class ShowCommand {
    private readonly client;
    constructor(client: Client);
    onShowSlash([interaction]: SlashCommandContext, { channel }: ShowDto): Promise<import("discord.js").InteractionResponse<boolean> | undefined>;
    onShowPrefix([message]: TextCommandContext, args: string[]): Promise<import("discord.js").OmitPartialGroupDMChannel<import("discord.js").Message<boolean>> | undefined>;
}
