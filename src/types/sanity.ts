export interface BotpressConfig {
    clientId?: string;
    personalAccessToken?: string;
    botId?: string;
    workspaceId?: string;
    embedCode?: string;
}

export interface Project {
    _id: string;
    name: string;
    botpress: BotpressConfig;
}
