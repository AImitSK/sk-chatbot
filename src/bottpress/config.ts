import { Client } from '@botpress/client';

const botpressClient = new Client({
    token: process.env.NEXT_PUBLIC_BOTPRESS_TOKEN!,
    workspaceId: process.env.NEXT_PUBLIC_BOTPRESS_WORKSPACE_ID!,
    botId: process.env.NEXT_PUBLIC_BOTPRESS_BOT_ID!,
});

export default botpressClient;