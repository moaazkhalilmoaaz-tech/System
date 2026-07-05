import { GuildMember } from 'discord.js';
import type { Role } from 'discord.js';
export declare class RoleGiveDto {
    user: GuildMember;
    role: Role;
}
export declare class RoleRemoveDto {
    user: GuildMember;
    role: Role;
}
export declare class RoleMultiDto {
    give_or_remove: string;
    role: Role;
    target: string;
}
