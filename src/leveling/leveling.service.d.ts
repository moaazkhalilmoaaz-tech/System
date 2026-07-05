import { OnApplicationBootstrap } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Leveling } from '../database/entities/leveling.entity';
import { Credit } from '../database/entities/credit.entity';
import { User, EmbedBuilder, ActionRowBuilder, ButtonBuilder, Client } from 'discord.js';
import { SettingsService } from '../api/settings/settings.service';
export declare class LevelingService implements OnApplicationBootstrap {
    private readonly levelingRepository;
    private readonly settingsService;
    private readonly client;
    constructor(levelingRepository: Repository<Leveling>, settingsService: SettingsService, client: Client);
    private readonly XP_REQUIREMENTS;
    getRequiredXp(level: number): number;
    getTotalXp(level: number, xp: number): number;
    calculateLevel(currentXp: number, currentLevel: number): {
        newLevel: number;
        remainingXp: number;
        leveledUp: boolean;
    };
    createRankCard(user: User, level: number, xp: number, royal: number, reputation: number, rank: number, status?: string, statusMessage?: string): Promise<Buffer<ArrayBufferLike>>;
    createRankImage(user: User, textLevel: number, textXp: number, textRank: number, voiceLevel: number, voiceXp: number, voiceRank: number, statusInput?: string): Promise<Buffer<ArrayBufferLike>>;
    private fillRoundedRect;
    getOrCreateUser(guildId: string, userId: string): Promise<Leveling>;
    private getResetBoundary;
    private checkAndResetPeriods;
    private lastMessageCache;
    addXp(guildId: string, userId: string, xpAmount: number, type: 'text' | 'voice', discordUser?: User): Promise<{
        leveledUp: boolean;
        newLevel?: undefined;
        user?: undefined;
        buffer?: undefined;
    } | {
        leveledUp: boolean;
        newLevel: number;
        user: Leveling;
        buffer: Buffer<ArrayBufferLike> | null;
    }>;
    createLevelUpImage(level: number, user: User): Promise<Buffer>;
    getUserRank(guildId: string, userId: string): Promise<number>;
    getUserVoiceRank(guildId: string, userId: string): Promise<number>;
    getTopUsers(guildId: string, limit: number, category?: string, timeframe?: string): Promise<Leveling[]>;
    getTopCredits(limit: number): Promise<Credit[]>;
    getUserBalance(userId: string): Promise<number>;
    generateTopData(guildId: string, category: string, timeframe: string): Promise<{
        embed: EmbedBuilder;
        rows: ActionRowBuilder<ButtonBuilder>[];
        imageBuffer: null;
    }>;
    onApplicationBootstrap(): void;
    private runMissedResets;
    handleDailyReset(): Promise<void>;
    handleWeeklyReset(): Promise<void>;
    handleMonthlyReset(): Promise<void>;
    handleDailyStats(): Promise<void>;
}
