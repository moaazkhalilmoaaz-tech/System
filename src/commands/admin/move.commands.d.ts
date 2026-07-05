import type { SlashCommandContext, TextCommandContext } from 'necord';
import { MoveDto } from '../dto/move.dto';
export declare class MoveCommand {
    move([interaction]: SlashCommandContext, { user, channel }: MoveDto): Promise<import("discord.js").Message<boolean>>;
    movePrefix([message]: TextCommandContext, args: string[]): Promise<import("discord.js").OmitPartialGroupDMChannel<import("discord.js").Message<boolean>> | undefined>;
}
