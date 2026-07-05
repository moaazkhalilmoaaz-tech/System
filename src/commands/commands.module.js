"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandsModule = void 0;
const common_1 = require("@nestjs/common");
const ping_commands_1 = require("./public/ping.commands");
const avatar_commands_1 = require("./public/avatar.commands");
const ban_commands_1 = require("./admin/ban.commands");
const unban_commands_1 = require("./admin/unban.commands");
const clear_commands_1 = require("./admin/clear.commands");
const kick_commands_1 = require("./admin/kick.commands");
const lock_commands_1 = require("./admin/lock.commands");
const unlock_commands_1 = require("./admin/unlock.commands");
const role_commands_1 = require("./admin/role.commands");
const mute_commands_1 = require("./admin/mute.commands");
const typeorm_1 = require("@nestjs/typeorm");
const mute_entity_1 = require("../database/entities/mute.entity");
const mute_listener_1 = require("../common/listeners/mute.listener");
const move_commands_1 = require("./admin/move.commands");
const point_entity_1 = require("../database/entities/point.entity");
const points_commands_1 = require("./points/points.commands");
const unmute_commands_1 = require("./admin/unmute.commands");
const hide_commands_1 = require("./admin/hide.commands");
const show_commands_1 = require("./admin/show.commands");
const timeout_commands_1 = require("./admin/timeout.commands");
const come_commands_1 = require("./admin/come.commands");
const user_commands_1 = require("./public/user.commands");
const say_commands_1 = require("./admin/say.commands");
const embed_commands_1 = require("./admin/embed.commands");
const send_commands_1 = require("./admin/send.commands");
const nickname_commands_1 = require("./admin/nickname.commands");
const untimeout_commands_1 = require("./admin/untimeout.commands");
const credit_entity_1 = require("../database/entities/credit.entity");
const credits_commands_1 = require("./coins/credits.commands");
const leaderboard_commands_1 = require("./coins/leaderboard.commands");
const addCredits_commands_1 = require("./coins/addCredits.commands");
const removeCredits_commands_1 = require("./coins/removeCredits.commands");
const tax_commands_1 = require("./coins/tax.commands");
const settings_module_1 = require("../api/settings/settings.module");
const warning_entity_1 = require("../database/entities/warning.entity");
const ban_entity_1 = require("../database/entities/ban.entity");
const warn_commands_1 = require("./admin/warn.commands");
const warn_remove_commands_1 = require("./admin/warn_remove.commands");
const warnings_commands_1 = require("./admin/warnings.commands");
const ban_listener_1 = require("../common/listeners/ban.listener");
const points_prefix_commands_1 = require("./points/points-prefix.commands");
const role_prefix_commands_1 = require("./admin/role-prefix.commands");
const admin_prefix_commands_1 = require("./admin/admin-prefix.commands");
let CommandsModule = class CommandsModule {
};
exports.CommandsModule = CommandsModule;
exports.CommandsModule = CommandsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            settings_module_1.SettingsModule,
            typeorm_1.TypeOrmModule.forFeature([
                mute_entity_1.Mute,
                point_entity_1.Point,
                credit_entity_1.Credit,
                warning_entity_1.Warning,
                ban_entity_1.Ban
            ]),
        ],
        providers: [
            ping_commands_1.PingCommand,
            avatar_commands_1.AvatarCommand,
            ban_commands_1.BanCommand,
            unban_commands_1.UnbanCommand,
            clear_commands_1.ClearCommand,
            kick_commands_1.KickCommand,
            lock_commands_1.LockCommand,
            unlock_commands_1.UnlockCommand,
            role_commands_1.RoleCommands,
            role_prefix_commands_1.RolePrefixHandler,
            move_commands_1.MoveCommand,
            mute_commands_1.MuteCommands,
            mute_listener_1.MuteListener,
            unmute_commands_1.UnmuteCommands,
            points_commands_1.PointsCommand,
            points_prefix_commands_1.PointsPrefixHandler,
            hide_commands_1.HideCommand,
            show_commands_1.ShowCommand,
            timeout_commands_1.TimeoutCommand,
            come_commands_1.ComeCommand,
            user_commands_1.UserCommand,
            say_commands_1.SayCommand,
            embed_commands_1.EmbedCommand,
            send_commands_1.SendCommand,
            nickname_commands_1.NicknameCommand,
            untimeout_commands_1.UntimeoutCommand,
            credits_commands_1.CreditsCommand,
            leaderboard_commands_1.LeaderboardCommand,
            addCredits_commands_1.AddCreditsCommand,
            removeCredits_commands_1.RemoveCreditsCommand,
            tax_commands_1.TaxCommand,
            warn_commands_1.WarnCommand,
            warn_remove_commands_1.WarnRemoveCommand,
            warnings_commands_1.WarningsCommand,
            ban_listener_1.BanCleanupService,
            admin_prefix_commands_1.AdminPrefixHandler
        ],
    })
], CommandsModule);
//# sourceMappingURL=commands.module.js.map