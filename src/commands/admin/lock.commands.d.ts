import type { SlashCommandContext, TextCommandContext } from 'necord';
import { Client } from 'discord.js';
import { LockDto } from './../dto/lock.dto';
export declare class LockCommand {
    private readonly client;
    constructor(client: Client);
    onLockSlash([interaction]: SlashCommandContext, { channel }: LockDto): Promise<import("discord.js").InteractionResponse<boolean> | undefined>;
    onLockPrefix([message]: TextCommandContext, args: string[]): Promise<import("discord.js").OmitPartialGroupDMChannel<import("discord.js").Message<boolean>> | undefined>;
}
