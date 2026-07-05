"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MuteEvent = void 0;
class MuteEvent {
    guildId;
    userId;
    executorId;
    duration;
    reason;
    type;
    constructor(guildId, userId, executorId, duration, reason, type) {
        this.guildId = guildId;
        this.userId = userId;
        this.executorId = executorId;
        this.duration = duration;
        this.reason = reason;
        this.type = type;
    }
}
exports.MuteEvent = MuteEvent;
;
//# sourceMappingURL=mute.event.js.map