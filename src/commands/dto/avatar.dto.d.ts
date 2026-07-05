import { User } from 'discord.js';
export type AvatarType = 'avatar' | 'banner' | 'server';
export declare class AvatarDto {
    user?: User;
    type?: AvatarType;
}
