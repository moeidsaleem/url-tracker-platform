// Location Interface
export interface Location {
    id?: string;
    latitude?: number;
    longitude?: number;
    nickname?: string;
    userId?: string;
    shareLinkId?: string;
    ip?: string;
    deviceId?: string;
    deviceType?: string;
    userAgent?: string;
    screenWidth?: number;
    screenHeight?: number;
    referrer?: string;
    userLanguage?: string;
    userTimezone?: string;
    updatedAt?: number;
    createdAt?: number;
}
