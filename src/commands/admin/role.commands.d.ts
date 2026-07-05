import type { SlashCommandContext } from 'necord';
import { RoleGiveDto, RoleMultiDto, RoleRemoveDto } from '../dto/role.dto';
export declare class RoleCommands {
    give([interaction]: SlashCommandContext, { user, role }: RoleGiveDto): Promise<import("discord.js").InteractionResponse<boolean> | undefined>;
    remove([interaction]: SlashCommandContext, { user, role }: RoleRemoveDto): Promise<import("discord.js").InteractionResponse<boolean> | undefined>;
    manageMultiple([interaction]: SlashCommandContext, { give_or_remove, role, target }: RoleMultiDto): Promise<import("discord.js").InteractionResponse<boolean> | undefined>;
}
