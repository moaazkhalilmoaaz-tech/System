import type { SlashCommandContext, TextCommandContext } from 'necord';
import { Client } from 'discord.js';
import { UnlockDto } from './../dto/unlock.dto';
export declare class UnlockCommand {
    private readonly client;
    constructor(client: Client);
    onUnlockSlash([interaction]: SlashCommandContext, { channel }: UnlockDto): Promise<import("discord.js").InteractionResponse<boolean> | undefined>;
    onUnlockPrefix([message]: TextCommandContext, args: string[]): Promise<import("discord.js").OmitPartialGroupDMChannel<import("discord.js").Message<boolean>> | undefined>;
}
