import { User } from 'discord.js';
export declare class PointsIncreaseDto {
    user: User;
    points: number;
}
export declare class PointsDecreaseDto {
    user: User;
    points: number;
}
export declare class PointsResetDto {
    user?: User;
}
