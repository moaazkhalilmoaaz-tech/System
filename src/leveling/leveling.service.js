"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LevelingService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const leveling_entity_1 = require("../database/entities/leveling.entity");
const credit_entity_1 = require("../database/entities/credit.entity");
const canvas_1 = require("@napi-rs/canvas");
const discord_js_1 = require("discord.js");
const settings_service_1 = require("../api/settings/settings.service");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const ASSETS_DIR = path.join(__dirname, '..', '..', 'leveling', 'assets');
try {
    const fontPath = path.join(ASSETS_DIR, 'fonts', 'Teko-Bold.ttf');
    canvas_1.GlobalFonts.registerFromPath(fontPath, 'Teko');
    console.log('[LevelingService] Font Teko registered from:', fontPath);
}
catch (error) {
    console.error('[LevelingService] Failed to register Teko font:', error);
}
let LevelingService = class LevelingService {
    levelingRepository;
    settingsService;
    client;
    constructor(levelingRepository, settingsService, client) {
        this.levelingRepository = levelingRepository;
        this.settingsService = settingsService;
        this.client = client;
    }
    XP_REQUIREMENTS = [
        500, 750, 800, 900, 1000, 1050, 1100, 1300, 1450, 1500,
        1550, 1600, 1650, 1750, 1800, 1900, 2050, 2100, 2150, 2250,
        2450, 2500, 2550, 2650, 2700, 2715, 2750, 2800, 2815, 3000,
        3150, 3250, 3300, 3450, 3500, 3615, 3700, 3850, 3900, 4000,
        4245, 4300, 4315, 4400, 4415, 4500, 4600, 4700, 4850, 5000,
        5100, 5150, 5300, 5350, 5370, 5400, 5500, 5515, 5700, 5900,
        6000, 6120, 6150, 6200, 6400, 6450, 6600, 6767, 6750, 6900,
        7100, 7015, 7400, 7500, 7550, 7600, 7670, 7777, 7850, 7900,
        8150, 8300, 8500, 8600, 8700, 8800, 8950, 9000, 9250, 9500,
        9750, 9850, 10000, 10050, 10170, 10250, 10300, 10500, 10950, 11000,
        12000
    ];
    getRequiredXp(level) {
        const index = Math.max(0, level - 1);
        if (index >= this.XP_REQUIREMENTS.length) {
            return this.XP_REQUIREMENTS[this.XP_REQUIREMENTS.length - 1];
        }
        return this.XP_REQUIREMENTS[index];
    }
    getTotalXp(level, xp) {
        let total = xp;
        for (let i = 1; i < level; i++) {
            total += this.getRequiredXp(i);
        }
        return total;
    }
    calculateLevel(currentXp, currentLevel) {
        let tempXp = currentXp;
        let tempLevel = currentLevel;
        let leveledUp = false;
        while (tempXp >= this.getRequiredXp(tempLevel)) {
            tempXp -= this.getRequiredXp(tempLevel);
            tempLevel++;
            leveledUp = true;
        }
        return { newLevel: tempLevel, remainingXp: tempXp, leveledUp };
    }
    async createRankCard(user, level, xp, royal, reputation, rank, status = 'offline', statusMessage = '') {
        const canvas = (0, canvas_1.createCanvas)(1000, 1000);
        const ctx = canvas.getContext('2d');
        const statusInput = (status || 'offline').toLowerCase();
        console.log(`[LevelingService] Aesthetics Card: ${user.tag}. Status: ${statusInput}`);
        let templateLoaded = false;
        const possiblePaths = [
            path.join(ASSETS_DIR, 'SDWG.png'),
            path.join(ASSETS_DIR, 'Profile1.png'),
        ];
        for (const p of possiblePaths) {
            if (fs.existsSync(p)) {
                try {
                    const buffer = fs.readFileSync(p);
                    const template = await (0, canvas_1.loadImage)(buffer);
                    ctx.drawImage(template, 0, 0, 1000, 1000);
                    templateLoaded = true;
                    console.log(`[LevelingService] Template loaded from: ${p}`);
                    break;
                }
                catch (err) { }
            }
        }
        if (!templateLoaded) {
            ctx.fillStyle = '#1e1e1e';
            ctx.fillRect(0, 0, 1000, 1000);
            console.log('[LevelingService] No template found, using dark background.');
        }
        const avX = 222, avY = 375, avR = 125;
        try {
            const avatar = await (0, canvas_1.loadImage)(user.displayAvatarURL({ extension: 'png', size: 512 }));
            ctx.beginPath();
            ctx.arc(avX, avY, avR + 4, 0, Math.PI * 2, true);
            ctx.fillStyle = '#111214';
            ctx.fill();
            ctx.closePath();
            ctx.save();
            ctx.beginPath();
            ctx.arc(avX, avY, avR, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.clip();
            ctx.drawImage(avatar, avX - avR, avY - avR, avR * 2, avR * 2);
            ctx.restore();
            const decorationURL = typeof user.avatarDecorationURL === 'function'
                ? user.avatarDecorationURL({ extension: 'png', size: 512 })
                : null;
            if (decorationURL) {
                const decoration = await (0, canvas_1.loadImage)(decorationURL);
                const decoSize = (avR + 18) * 2;
                ctx.drawImage(decoration, avX - (decoSize / 2), avY - (decoSize / 2), decoSize, decoSize);
            }
        }
        catch (e) {
            console.error('[LevelingService] Avatar/Deco load failed:', e.message);
        }
        const sX = 310, sY = 465, sR = 26;
        ctx.beginPath();
        ctx.arc(sX, sY, sR + 6, 0, Math.PI * 2, true);
        ctx.fillStyle = '#111214';
        ctx.fill();
        ctx.closePath();
        if (statusInput === 'online') {
            ctx.beginPath();
            ctx.arc(sX, sY, sR, 0, Math.PI * 2);
            ctx.fillStyle = '#23a559';
            ctx.fill();
            ctx.closePath();
        }
        else if (statusInput === 'idle') {
            ctx.beginPath();
            ctx.arc(sX, sY, sR, 0, Math.PI * 2);
            ctx.fillStyle = '#f0b132';
            ctx.fill();
            ctx.closePath();
            ctx.globalCompositeOperation = 'destination-out';
            ctx.beginPath();
            ctx.arc(sX - 6, sY - 6, sR - 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.closePath();
            ctx.globalCompositeOperation = 'source-over';
            ctx.beginPath();
            ctx.arc(sX - 6, sY - 6, sR - 2, 0, Math.PI * 2);
            ctx.fillStyle = '#111214';
            ctx.fill();
            ctx.closePath();
        }
        else if (statusInput === 'dnd') {
            ctx.beginPath();
            ctx.arc(sX, sY, sR, 0, Math.PI * 2);
            ctx.fillStyle = '#f23f42';
            ctx.fill();
            ctx.closePath();
            ctx.fillStyle = '#111214';
            ctx.fillRect(sX - 13, sY - 4, 26, 8);
        }
        else {
            ctx.beginPath();
            ctx.arc(sX, sY, sR, 0, Math.PI * 2);
            ctx.fillStyle = '#80848e';
            ctx.fill();
            ctx.closePath();
            ctx.beginPath();
            ctx.arc(sX, sY, sR - 8, 0, Math.PI * 2);
            ctx.fillStyle = '#111214';
            ctx.fill();
            ctx.closePath();
        }
        ctx.fillStyle = '#FFFFFF';
        ctx.textAlign = 'left';
        const fontDisplay = 'bold 36px Teko';
        const fontValue = 'bold 42px Teko';
        const labelValueX = 120;
        const statsYStart = 590;
        const statsSpacing = 100;
        const ageInMs = Date.now() - user.createdAt.getTime();
        const ageInDays = Math.floor(ageInMs / (1000 * 60 * 60 * 24));
        ctx.font = fontValue;
        ctx.fillText(`${ageInDays} Days`, labelValueX, statsYStart);
        ctx.font = fontValue;
        ctx.fillText(`${reputation}`, labelValueX, statsYStart + statsSpacing);
        ctx.fillStyle = '#1e1e1e';
        ctx.fillStyle = '#FFFFFF';
        ctx.font = fontValue;
        ctx.fillText(`${royal}`, labelValueX, statsYStart + statsSpacing * 2);
        ctx.font = fontValue;
        ctx.fillText(`#${rank}`, labelValueX, statsYStart + statsSpacing * 3);
        const requiredXp = this.getRequiredXp(level);
        const xpPercent = Math.min(xp / requiredXp, 1);
        const barX = 445;
        const barY = 790;
        const barWidth = 405;
        const barHeight = 58;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        this.fillRoundedRect(ctx, barX, barY, barWidth, barHeight, 28);
        if (xpPercent > 0) {
            const gradient = ctx.createLinearGradient(barX, 0, barX + barWidth, 0);
            gradient.addColorStop(0, '#0f0528');
            gradient.addColorStop(1, '#4c109b');
            ctx.fillStyle = gradient;
            this.fillRoundedRect(ctx, barX, barY, barWidth * xpPercent, barHeight, 28);
        }
        ctx.font = 'bold 28px Teko';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#FFFFFF';
        ctx.shadowColor = '#000000';
        ctx.shadowBlur = 10;
        ctx.fillText(`${xp.toLocaleString()} / ${requiredXp.toLocaleString()}`, 657, 832);
        ctx.font = 'bold 24px Teko';
        ctx.textAlign = 'left';
        ctx.fillText(`${this.getTotalXp(level, xp).toLocaleString()}`, 700, 882);
        ctx.font = 'bold 44px Teko';
        ctx.textAlign = 'left';
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(user.username.toUpperCase(), 380, 400);
        if (statusMessage) {
            ctx.font = 'italic 24px Teko';
            ctx.fillStyle = '#b9bbbe';
            ctx.fillText(statusMessage.length > 150 ? statusMessage.substring(0, 100) + '...' : statusMessage, 380, 440);
        }
        console.log(`[LevelingService] Aesthetics card COMPLETED with stats.`);
        return canvas.toBuffer('image/png');
    }
    async createRankImage(user, textLevel, textXp, textRank, voiceLevel, voiceXp, voiceRank, statusInput = 'offline') {
        let canvasWidth = 912;
        let canvasHeight = 422;
        let templateLoaded = false;
        let template;
        const possiblePaths = [
            path.join(ASSETS_DIR, 'rank.png'),
            path.join(ASSETS_DIR, 'Rank.png'),
        ];
        for (const p of possiblePaths) {
            if (fs.existsSync(p)) {
                try {
                    template = await (0, canvas_1.loadImage)(fs.readFileSync(p));
                    canvasWidth = template.width;
                    canvasHeight = template.height;
                    templateLoaded = true;
                    console.log(`[LevelingService] Rank Template loaded from: ${p} (Size: ${canvasWidth}x${canvasHeight})`);
                    break;
                }
                catch (err) { }
            }
        }
        const canvas = (0, canvas_1.createCanvas)(canvasWidth, canvasHeight);
        const ctx = canvas.getContext('2d');
        if (templateLoaded) {
            ctx.drawImage(template, 0, 0, canvasWidth, canvasHeight);
        }
        else {
            ctx.fillStyle = '#1e1e1e';
            ctx.fillRect(0, 0, canvasWidth, canvasHeight);
            console.log('[LevelingService] Rank template not found, using dark background.');
        }
        const avX = 178;
        const avY = 160;
        const avR = 90;
        try {
            const avatar = await (0, canvas_1.loadImage)(user.displayAvatarURL({ extension: 'png', size: 512 }));
            ctx.beginPath();
            ctx.arc(avX, avY, avR + 4, 0, Math.PI * 2, true);
            ctx.fillStyle = '#111214';
            ctx.fill();
            ctx.closePath();
            ctx.save();
            ctx.beginPath();
            ctx.arc(avX, avY, avR, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.clip();
            ctx.drawImage(avatar, avX - avR, avY - avR, avR * 2, avR * 2);
            ctx.restore();
            const decorationURL = typeof user.avatarDecorationURL === 'function' ? user.avatarDecorationURL({ extension: 'png', size: 512 }) : null;
            if (decorationURL) {
                const decoration = await (0, canvas_1.loadImage)(decorationURL);
                const decoSize = (avR + 15) * 2;
                ctx.drawImage(decoration, avX - (decoSize / 2), avY - (decoSize / 2), decoSize, decoSize);
            }
        }
        catch (e) {
            console.error('[LevelingService] Rank Avatar load failed:', e.message);
        }
        const sX = avX + avR * 0.75;
        const sY = avY + avR * 0.75;
        const sR = 20;
        ctx.beginPath();
        ctx.arc(sX, sY, sR + 4, 0, Math.PI * 2, true);
        ctx.fillStyle = '#111214';
        ctx.fill();
        ctx.closePath();
        if (statusInput === 'online') {
            ctx.beginPath();
            ctx.arc(sX, sY, sR, 0, Math.PI * 2);
            ctx.fillStyle = '#23a559';
            ctx.fill();
            ctx.closePath();
        }
        else if (statusInput === 'idle') {
            ctx.beginPath();
            ctx.arc(sX, sY, sR, 0, Math.PI * 2);
            ctx.fillStyle = '#f0b132';
            ctx.fill();
            ctx.closePath();
            ctx.globalCompositeOperation = 'destination-out';
            ctx.beginPath();
            ctx.arc(sX - 5, sY - 5, sR - 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.closePath();
            ctx.globalCompositeOperation = 'source-over';
        }
        else if (statusInput === 'dnd') {
            ctx.beginPath();
            ctx.arc(sX, sY, sR, 0, Math.PI * 2);
            ctx.fillStyle = '#f23f42';
            ctx.fill();
            ctx.closePath();
            ctx.fillStyle = '#111214';
            ctx.fillRect(sX - 10, sY - 3, 20, 6);
        }
        else {
            ctx.beginPath();
            ctx.arc(sX, sY, sR, 0, Math.PI * 2);
            ctx.fillStyle = '#80848e';
            ctx.fill();
            ctx.closePath();
            ctx.beginPath();
            ctx.arc(sX, sY, sR - 6, 0, Math.PI * 2);
            ctx.fillStyle = '#111214';
            ctx.fill();
            ctx.closePath();
        }
        const requiredTextXP = this.getRequiredXp(textLevel);
        const textProgress = Math.min(textXp / requiredTextXP, 1);
        const requiredVoiceXP = this.getRequiredXp(voiceLevel);
        const voiceProgress = Math.min(voiceXp / requiredVoiceXP, 1);
        const barX = 352;
        const barWidth = 406;
        const barHeight = 24;
        const barY1 = 225;
        const barY2 = 290;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
        this.fillRoundedRect(ctx, barX, barY1, barWidth, barHeight, 15);
        this.fillRoundedRect(ctx, barX, barY2, barWidth, barHeight, 15);
        if (textProgress > 0) {
            const gradient = ctx.createLinearGradient(barX, 0, barX + barWidth, 0);
            gradient.addColorStop(0, '#8b5cf6');
            gradient.addColorStop(1, '#d8b4fe');
            ctx.fillStyle = gradient;
            const displayWidth = Math.max(barWidth * textProgress, 25);
            this.fillRoundedRect(ctx, barX, barY1, displayWidth, barHeight, 25);
        }
        if (voiceProgress > 0) {
            const gradient = ctx.createLinearGradient(barX, 0, barX + barWidth, 0);
            gradient.addColorStop(0, '#10b981');
            gradient.addColorStop(1, '#6ee7b7');
            ctx.fillStyle = gradient;
            const displayWidth = Math.max(barWidth * voiceProgress, 25);
            this.fillRoundedRect(ctx, barX, barY2, displayWidth, barHeight, 25);
        }
        ctx.fillStyle = '#FFFFFF';
        ctx.shadowColor = 'rgba(0,0,0,0.8)';
        ctx.shadowBlur = 4;
        ctx.font = 'bold 36px Teko';
        ctx.textAlign = 'left';
        ctx.fillText(user.username.toUpperCase(), 350, 150);
        ctx.font = 'bold 18px Teko';
        const textRowY = 217;
        ctx.textAlign = 'center';
        ctx.fillText(`${textLevel}`, 325, 245);
        ctx.fillText(`#${textRank}`, 420, textRowY);
        ctx.textAlign = 'left';
        ctx.fillText(`${textXp.toLocaleString()} / ${requiredTextXP.toLocaleString()} XP`, 715, textRowY);
        const voiceRowY = 280;
        ctx.textAlign = 'center';
        ctx.fillText(`${voiceLevel}`, 325, 310);
        ctx.fillText(`#${voiceRank}`, 420, voiceRowY);
        ctx.textAlign = 'left';
        ctx.fillText(`${voiceXp.toLocaleString()} / ${requiredVoiceXP.toLocaleString()} XP`, 715, voiceRowY);
        ctx.shadowBlur = 0;
        return canvas.toBuffer('image/png');
    }
    fillRoundedRect(ctx, x, y, width, height, radius) {
        if (width < 2 * radius)
            radius = width / 2;
        if (height < 2 * radius)
            radius = height / 2;
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.arcTo(x + width, y, x + width, y + height, radius);
        ctx.arcTo(x + width, y + height, x, y + height, radius);
        ctx.arcTo(x, y + height, x, y, radius);
        ctx.arcTo(x, y, x + width, y, radius);
        ctx.closePath();
        ctx.fill();
    }
    async getOrCreateUser(guildId, userId) {
        let user = await this.levelingRepository.findOne({ where: { guildId, userId } });
        if (!user) {
            user = this.levelingRepository.create({ guildId, userId });
            await this.levelingRepository.save(user);
        }
        return user;
    }
    getResetBoundary(type) {
        const nowRiyadh = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Riyadh' }));
        if (type === 'daily') {
            const boundary = new Date(nowRiyadh);
            boundary.setHours(3, 0, 0, 0);
            if (nowRiyadh < boundary) {
                boundary.setDate(boundary.getDate() - 1);
            }
            return boundary;
        }
        else if (type === 'weekly') {
            const boundary = new Date(nowRiyadh);
            boundary.setHours(3, 0, 0, 0);
            const day = boundary.getDay();
            boundary.setDate(boundary.getDate() - day);
            if (nowRiyadh < boundary) {
                boundary.setDate(boundary.getDate() - 7);
            }
            return boundary;
        }
        else {
            const boundary = new Date(nowRiyadh);
            boundary.setDate(1);
            boundary.setHours(3, 0, 0, 0);
            if (nowRiyadh < boundary) {
                boundary.setMonth(boundary.getMonth() - 1);
            }
            return boundary;
        }
    }
    checkAndResetPeriods(user) {
        const now = new Date();
        let changed = false;
        const dailyBoundary = this.getResetBoundary('daily');
        if (!user.lastDailyReset || user.lastDailyReset < dailyBoundary) {
            user.dailyTextXp = 0;
            user.dailyVoiceXp = 0;
            user.lastDailyReset = now;
            changed = true;
        }
        const weeklyBoundary = this.getResetBoundary('weekly');
        if (!user.lastWeeklyReset || user.lastWeeklyReset < weeklyBoundary) {
            user.weeklyTextXp = 0;
            user.weeklyVoiceXp = 0;
            user.lastWeeklyReset = now;
            changed = true;
        }
        const monthlyBoundary = this.getResetBoundary('monthly');
        if (!user.lastMonthlyReset || user.lastMonthlyReset < monthlyBoundary) {
            user.monthlyTextXp = 0;
            user.monthlyVoiceXp = 0;
            user.lastMonthlyReset = now;
            changed = true;
        }
        return changed;
    }
    lastMessageCache = new Map();
    async addXp(guildId, userId, xpAmount, type, discordUser) {
        if (type === 'text') {
            const cacheKey = `${guildId}:${userId}`;
            const nowMs = Date.now();
            const lastMessageMs = this.lastMessageCache.get(cacheKey);
            if (lastMessageMs && (nowMs - lastMessageMs < 60000)) {
                return { leveledUp: false };
            }
            this.lastMessageCache.set(cacheKey, nowMs);
        }
        const user = await this.getOrCreateUser(guildId, userId);
        this.checkAndResetPeriods(user);
        if (type === 'text') {
            const now = new Date();
            user.textXp += xpAmount;
            user.dailyTextXp += xpAmount;
            user.weeklyTextXp += xpAmount;
            user.monthlyTextXp += xpAmount;
            user.lastMessageTimestamp = now;
            const { newLevel, remainingXp, leveledUp } = this.calculateLevel(user.textXp, user.textLevel);
            if (leveledUp) {
                user.textLevel = newLevel;
                user.textXp = remainingXp;
            }
            await this.levelingRepository.save(user);
            let buffer = null;
            if (leveledUp && user.textLevel === 100 && discordUser) {
                buffer = await this.createLevelUpImage(user.textLevel, discordUser);
            }
            return { leveledUp, newLevel, user, buffer };
        }
        else {
            user.voiceXp += xpAmount;
            user.dailyVoiceXp += xpAmount;
            user.weeklyVoiceXp += xpAmount;
            user.monthlyVoiceXp += xpAmount;
            const { newLevel, remainingXp, leveledUp } = this.calculateLevel(user.voiceXp, user.voiceLevel);
            if (leveledUp) {
                user.voiceLevel = newLevel;
                user.voiceXp = remainingXp;
            }
            await this.levelingRepository.save(user);
            let buffer = null;
            if (leveledUp && user.voiceLevel === 100 && discordUser) {
                buffer = await this.createLevelUpImage(user.voiceLevel, discordUser);
            }
            return { leveledUp, newLevel, user, buffer };
        }
    }
    async createLevelUpImage(level, user) {
        const templateName = 'Level-Max.png';
        const templatePath = path.join(ASSETS_DIR, templateName);
        if (!fs.existsSync(templatePath)) {
            console.error('[LevelingService] Level-Max.png not found at:', templatePath);
            return Buffer.alloc(0);
        }
        const templateBuffer = fs.readFileSync(templatePath);
        const template = await (0, canvas_1.loadImage)(templateBuffer);
        const canvas = (0, canvas_1.createCanvas)(template.width, template.height);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(template, 0, 0);
        try {
            const avatar = await (0, canvas_1.loadImage)(user.displayAvatarURL({ extension: 'png', size: 512 }));
            const avSize = 850;
            const avX = canvas.width / 2;
            const avY = canvas.height / 2 - 160;
            ctx.save();
            ctx.beginPath();
            ctx.arc(avX, avY, avSize / 2, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.clip();
            ctx.drawImage(avatar, avX - avSize / 2, avY - avSize / 2, avSize, avSize);
            ctx.restore();
            ctx.beginPath();
            ctx.arc(avX, avY, avSize / 2, 0, Math.PI * 2, true);
            ctx.strokeStyle = '#FFFFFF';
            ctx.lineWidth = 5;
            ctx.stroke();
            ctx.closePath();
        }
        catch (e) {
            console.error('Failed to load avatar for level up image:', e);
        }
        return canvas.toBuffer('image/png');
    }
    async getUserRank(guildId, userId) {
        const users = await this.levelingRepository.find({
            where: { guildId },
            order: { textLevel: 'DESC', textXp: 'DESC' }
        });
        const rank = users.findIndex(u => u.userId === userId) + 1;
        return rank || 0;
    }
    async getUserVoiceRank(guildId, userId) {
        const users = await this.levelingRepository.find({
            where: { guildId },
            order: { voiceLevel: 'DESC', voiceXp: 'DESC' }
        });
        const rank = users.findIndex(u => u.userId === userId) + 1;
        return rank || 0;
    }
    async getTopUsers(guildId, limit, category = 'text', timeframe = 'all') {
        const order = {};
        if (category === 'text') {
            if (timeframe === 'daily')
                order.dailyTextXp = 'DESC';
            else if (timeframe === 'weekly')
                order.weeklyTextXp = 'DESC';
            else if (timeframe === 'monthly')
                order.monthlyTextXp = 'DESC';
            else
                order.textLevel = 'DESC';
            if (order.textLevel)
                order.textXp = 'DESC';
        }
        else if (category === 'voice') {
            if (timeframe === 'daily')
                order.dailyVoiceXp = 'DESC';
            else if (timeframe === 'weekly')
                order.weeklyVoiceXp = 'DESC';
            else if (timeframe === 'monthly')
                order.monthlyVoiceXp = 'DESC';
            else
                order.voiceLevel = 'DESC';
            if (order.voiceLevel)
                order.voiceXp = 'DESC';
        }
        else if (category === 'rep') {
            order.reputation = 'DESC';
        }
        else if (category === 'royal') {
            order.royal = 'DESC';
        }
        return this.levelingRepository.find({
            where: { guildId },
            order,
            take: limit
        });
    }
    async getTopCredits(limit) {
        const repo = this.levelingRepository.manager.getRepository(credit_entity_1.Credit);
        return repo.find({
            order: { credit: 'DESC' },
            take: limit
        });
    }
    async getUserBalance(userId) {
        const repo = this.levelingRepository.manager.getRepository(credit_entity_1.Credit);
        const data = await repo.findOne({ where: { userId } });
        return data?.credit ?? 0;
    }
    async generateTopData(guildId, category, timeframe) {
        let title = '';
        let description = '';
        const tfLabel = timeframe === 'daily' ? 'Today' : timeframe === 'weekly' ? 'This Week' : timeframe === 'monthly' ? 'This Month' : 'All-time';
        if (category === 'text') {
            title = `💬 Top 10 Chat (${tfLabel})`;
            const data = await this.getTopUsers(guildId, 10, 'text', timeframe);
            description = data.map((u, i) => {
                const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`;
                const xpValue = timeframe === 'daily' ? u.dailyTextXp : timeframe === 'weekly' ? u.weeklyTextXp : u.monthlyTextXp;
                const val = timeframe === 'all' ? `Level ${u.textLevel}` : `${xpValue.toLocaleString()} XP`;
                return `${medal} | <@${u.userId}> - **${val}**`;
            }).join('\n');
        }
        else if (category === 'voice') {
            title = `🎙️ Top 10 Voice (${tfLabel})`;
            const data = await this.getTopUsers(guildId, 10, 'voice', timeframe);
            description = data.map((u, i) => {
                const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`;
                const xpValue = timeframe === 'daily' ? u.dailyVoiceXp : timeframe === 'weekly' ? u.weeklyVoiceXp : u.monthlyVoiceXp;
                const val = timeframe === 'all' ? `Level ${u.voiceLevel}` : `${xpValue.toLocaleString()} XP`;
                return `${medal} | <@${u.userId}> - **${val}**`;
            }).join('\n');
        }
        else if (category === 'royals') {
            title = '💰 Top 10 Royals (Global)';
            const data = await this.getTopCredits(10);
            description = data.map((u, i) => {
                const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`;
                return `${medal} | <@${u.userId}> - **$${u.credit.toLocaleString()}**`;
            }).join('\n');
        }
        const embed = new discord_js_1.EmbedBuilder()
            .setAuthor({ name: title })
            .setColor('#2F3136')
            .setDescription(description || '*لا يوجد بيانات بعد.*')
            .setTimestamp();
        const rowText = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder().setCustomId('top:text:daily').setLabel('Chat Today').setStyle(discord_js_1.ButtonStyle.Secondary).setEmoji('💬'), new discord_js_1.ButtonBuilder().setCustomId('top:text:weekly').setLabel('Chat Week').setStyle(discord_js_1.ButtonStyle.Secondary).setEmoji('💬'), new discord_js_1.ButtonBuilder().setCustomId('top:text:monthly').setLabel('Chat Month').setStyle(discord_js_1.ButtonStyle.Secondary).setEmoji('💬'), new discord_js_1.ButtonBuilder().setCustomId('top:text:all').setLabel('Chat All').setStyle(discord_js_1.ButtonStyle.Secondary).setEmoji('💬'));
        const rowVoice = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder().setCustomId('top:voice:daily').setLabel('Voice Today').setStyle(discord_js_1.ButtonStyle.Secondary).setEmoji('🎙️'), new discord_js_1.ButtonBuilder().setCustomId('top:voice:weekly').setLabel('Voice Week').setStyle(discord_js_1.ButtonStyle.Secondary).setEmoji('🎙️'), new discord_js_1.ButtonBuilder().setCustomId('top:voice:monthly').setLabel('Voice Month').setStyle(discord_js_1.ButtonStyle.Secondary).setEmoji('🎙️'), new discord_js_1.ButtonBuilder().setCustomId('top:voice:all').setLabel('Voice All').setStyle(discord_js_1.ButtonStyle.Secondary).setEmoji('🎙️'));
        const rowOther = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder().setCustomId('top:royals:all').setLabel('Royals').setStyle(discord_js_1.ButtonStyle.Success).setEmoji('💰'));
        return { embed, rows: [rowText, rowVoice, rowOther], imageBuffer: null };
    }
    onApplicationBootstrap() {
        setTimeout(() => this.runMissedResets(), 5000);
    }
    async runMissedResets() {
        console.log('[LevelingService] Startup: checking for missed XP resets...');
        const now = new Date();
        try {
            const dailyBoundary = this.getResetBoundary('daily');
            const needsDaily = await this.levelingRepository
                .createQueryBuilder('l')
                .where('l.lastDailyReset IS NULL OR l.lastDailyReset < :b', { b: dailyBoundary })
                .getCount();
            if (needsDaily > 0) {
                console.log(`[LevelingService] Startup: ${needsDaily} members need daily reset — running now.`);
                await this.levelingRepository.createQueryBuilder()
                    .update()
                    .set({ dailyTextXp: 0, dailyVoiceXp: 0, lastDailyReset: now })
                    .execute();
                console.log('[LevelingService] Startup: Daily reset DONE.');
            }
            else {
                console.log('[LevelingService] Startup: Daily reset not needed.');
            }
            const weeklyBoundary = this.getResetBoundary('weekly');
            const needsWeekly = await this.levelingRepository
                .createQueryBuilder('l')
                .where('l.lastWeeklyReset IS NULL OR l.lastWeeklyReset < :b', { b: weeklyBoundary })
                .getCount();
            if (needsWeekly > 0) {
                console.log(`[LevelingService] Startup: ${needsWeekly} members need weekly reset — running now.`);
                await this.levelingRepository.createQueryBuilder()
                    .update()
                    .set({ weeklyTextXp: 0, weeklyVoiceXp: 0, lastWeeklyReset: now })
                    .execute();
                console.log('[LevelingService] Startup: Weekly reset DONE.');
            }
            else {
                console.log('[LevelingService] Startup: Weekly reset not needed.');
            }
            const monthlyBoundary = this.getResetBoundary('monthly');
            const needsMonthly = await this.levelingRepository
                .createQueryBuilder('l')
                .where('l.lastMonthlyReset IS NULL OR l.lastMonthlyReset < :b', { b: monthlyBoundary })
                .getCount();
            if (needsMonthly > 0) {
                console.log(`[LevelingService] Startup: ${needsMonthly} members need monthly reset — running now.`);
                await this.levelingRepository.createQueryBuilder()
                    .update()
                    .set({ monthlyTextXp: 0, monthlyVoiceXp: 0, lastMonthlyReset: now })
                    .execute();
                console.log('[LevelingService] Startup: Monthly reset DONE.');
            }
            else {
                console.log('[LevelingService] Startup: Monthly reset not needed.');
            }
        }
        catch (err) {
            console.error('[LevelingService] Startup missed-reset check FAILED:', err);
        }
    }
    async handleDailyReset() {
        console.log('[LevelingService] Running Daily XP Reset (Saudi Time 3 AM)...');
        try {
            const now = new Date();
            await this.levelingRepository.createQueryBuilder()
                .update()
                .set({ dailyTextXp: 0, dailyVoiceXp: 0, lastDailyReset: now })
                .execute();
            console.log('[LevelingService] Daily XP Reset COMPLETED.');
        }
        catch (error) {
            console.error('[LevelingService] Daily XP Reset FAILED:', error);
        }
    }
    async handleWeeklyReset() {
        console.log('[LevelingService] Running Weekly XP Reset (Saudi Time 3 AM, Sunday)...');
        try {
            const now = new Date();
            await this.levelingRepository.createQueryBuilder()
                .update()
                .set({ weeklyTextXp: 0, weeklyVoiceXp: 0, lastWeeklyReset: now })
                .execute();
            console.log('[LevelingService] Weekly XP Reset COMPLETED.');
        }
        catch (error) {
            console.error('[LevelingService] Weekly XP Reset FAILED:', error);
        }
    }
    async handleMonthlyReset() {
        console.log('[LevelingService] Running Monthly XP Reset (Saudi Time 3 AM, 1st day of Month)...');
        try {
            const now = new Date();
            await this.levelingRepository.createQueryBuilder()
                .update()
                .set({ monthlyTextXp: 0, monthlyVoiceXp: 0, lastMonthlyReset: now })
                .execute();
            console.log('[LevelingService] Monthly XP Reset COMPLETED.');
        }
        catch (error) {
            console.error('[LevelingService] Monthly XP Reset FAILED:', error);
        }
    }
    async handleDailyStats() {
        console.log('[LevelingService] Posting Daily Stats (2:50 AM Saudi)...');
        const guilds = this.client.guilds.cache;
        for (const [guildId, guild] of guilds) {
            try {
                const settings = await this.settingsService.getGuildSettings(guildId);
                const statsChannelId = settings?.leveling?.statsChannelId || '1487683273004945449';
                if (statsChannelId) {
                    const channel = await guild.channels.fetch(statsChannelId).catch(() => null);
                    if (channel && channel.isTextBased()) {
                        const { embed } = await this.generateTopData(guildId, 'text', 'daily');
                        embed.setTitle('📊 الخبر اليومي (قبل التصفير بـ 10 دقائق)');
                        await channel.send({ embeds: [embed] });
                        console.log(`[LevelingService] Stats sent to guild ${guild.name} (${guildId}) using channel ${statsChannelId}`);
                    }
                }
            }
            catch (err) {
                console.error(`[LevelingService] Failed to send daily stats for guild ${guildId}:`, err);
            }
        }
    }
};
exports.LevelingService = LevelingService;
__decorate([
    (0, schedule_1.Cron)('0 0 3 * * *', { timeZone: 'Asia/Riyadh' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LevelingService.prototype, "handleDailyReset", null);
__decorate([
    (0, schedule_1.Cron)('0 0 3 * * 0', { timeZone: 'Asia/Riyadh' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LevelingService.prototype, "handleWeeklyReset", null);
__decorate([
    (0, schedule_1.Cron)('0 0 3 1 * *', { timeZone: 'Asia/Riyadh' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LevelingService.prototype, "handleMonthlyReset", null);
__decorate([
    (0, schedule_1.Cron)('0 50 2 * * *', { timeZone: 'Asia/Riyadh' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LevelingService.prototype, "handleDailyStats", null);
exports.LevelingService = LevelingService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(leveling_entity_1.Leveling)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        settings_service_1.SettingsService,
        discord_js_1.Client])
], LevelingService);
//# sourceMappingURL=leveling.service.js.map
