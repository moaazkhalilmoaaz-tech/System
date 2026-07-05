"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkCommandPermissions = checkCommandPermissions;
const discord_js_1 = require("discord.js");
async function checkCommandPermissions(context, settings, commandName, fallbackPerm) {
    await Promise.resolve();
    const guild = context.guild;
    if (!guild)
        return { allowed: false, message: 'Guild not found' };
    const member = context.member;
    const moderatorId = context instanceof discord_js_1.Message ? context.author.id : context.user?.id;
    if (!member)
        return { allowed: false, message: 'Member not found' };
    const owners = Array.isArray(settings?.owners) ? settings.owners.map((o) => String(o).trim()) : [];
    const isOwner = owners.includes(moderatorId) || guild.ownerId === moderatorId;
    const isAdmin = member.permissions.has(discord_js_1.PermissionsBitField.Flags.Administrator);
    if (isOwner || isAdmin)
        return { allowed: true };
    const cmdConfig = settings?.commands?.find((c) => c.name.toLowerCase() === commandName.toLowerCase());
    const channelId = context.channelId;
    const parentId = context.channel?.parentId || null;
    const normalizeIds = (input) => {
        if (Array.isArray(input))
            return input.map(id => String(id).trim()).filter(Boolean);
        if (typeof input === 'string')
            return input.split(/[,\s]+/).map(s => s.trim()).filter(Boolean);
        return [];
    };
    const allowedChannels = normalizeIds(cmdConfig?.allowedChannels);
    const deniedChannels = normalizeIds(cmdConfig?.deniedChannels);
    if (deniedChannels.some(id => id === channelId || id === parentId)) {
        return { allowed: false, message: 'This command is disabled in this channel.' };
    }
    if (allowedChannels.length > 0 && !allowedChannels.some(id => id === channelId || id === parentId)) {
        return { allowed: false, message: 'This command is not allowed in this channel.' };
    }
    const memberRoles = member.roles.cache;
    const allowedRoles = normalizeIds(cmdConfig?.allowedRoles);
    const deniedRoles = normalizeIds(cmdConfig?.deniedRoles);
    if (deniedRoles.some(id => memberRoles.has(id))) {
        return { allowed: false, message: 'You have a restricted role and cannot use this command.' };
    }
    const hasAllowedRole = allowedRoles.some(id => memberRoles.has(id));
    if (allowedRoles.length > 0) {
        if (hasAllowedRole)
            return { allowed: true };
        return { allowed: false, message: 'You do not have the required role to use this command.' };
    }
    if (fallbackPerm && !member.permissions.has(fallbackPerm)) {
        return { allowed: false, message: 'You do not have the required Discord permissions to use this command.' };
    }
    return { allowed: true };
}
//# sourceMappingURL=permission.utils.js.map