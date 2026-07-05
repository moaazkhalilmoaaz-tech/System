import type { SlashCommandContext, TextCommandContext } from 'necord';
import { HideDto } from './../dto/hide.dto';
export declare class HideCommand {
    constructor();
    onHideSlash([interaction]: SlashCommandContext, { channel }: HideDto): Promise<import("discord.js").InteractionResponse<boolean> | undefined>;
    onHidePrefix([message]: TextCommandContext, args: string[]): Promise<import("discord.js").OmitPartialGroupDMChannel<import("discord.js").Message<boolean>> | undefined>;
}
