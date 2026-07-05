import type { SlashCommandContext } from 'necord';
import { PointsDecreaseDto, PointsIncreaseDto, PointsResetDto } from '../dto/points.dto';
import { Repository } from 'typeorm';
import { Point } from 'src/database/entities/point.entity';
import { NecordPaginationService } from '@necord/pagination';
import { SettingsService } from './../../api/settings/settings.service';
export declare class PointsCommand {
    private pointRepository;
    private readonly paginationService;
    private readonly settingService;
    constructor(pointRepository: Repository<Point>, paginationService: NecordPaginationService, settingService: SettingsService);
    pointsIncrease([interaction]: SlashCommandContext, { user, points }: PointsIncreaseDto): Promise<import("discord.js").InteractionResponse<boolean>>;
    pointsDecrease([interaction]: SlashCommandContext, { user, points }: PointsDecreaseDto): Promise<import("discord.js").InteractionResponse<boolean>>;
    pointsReset([interaction]: SlashCommandContext, { user }: PointsResetDto): Promise<import("discord.js").InteractionResponse<boolean>>;
    pointsList([interaction]: SlashCommandContext): Promise<import("discord.js").InteractionResponse<boolean> | undefined>;
}
