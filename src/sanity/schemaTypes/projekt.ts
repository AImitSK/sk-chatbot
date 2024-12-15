import { defineField, defineType } from 'sanity';

export const projekt = defineType({
    type: "document",
    name: "projekt",
    title: "Projekt",
    fields: [
        defineField({
            type: "string",
            name: "name",
            title: "Projektname",
            validation: (e) => e.required(),
        }),
        defineField({
            type: "reference",
            name: "firma",
            title: "Firma",
            to: [{ type: "Firma" }],
            validation: (e) => e.required(),
        }),
        defineField({
            type: "array",
            name: "users",
            title: "Benutzer",
            of: [{ type: "reference", to: [{ type: "user" }] }],
            validation: (e) => e.required(),
        }),
        defineField({
            type: "reference",
            name: "vertragsmodell",
            title: "Vertragsmodell",
            to: [{ type: "vertragsmodelle" }],
            validation: (e) => e.required(),
        }),
        defineField({
            type: "date",
            name: "vertragsbeginn",
            title: "Vertragsbeginn",
            validation: (e) => e.required(),
        }),
        defineField({
            type: "date",
            name: "vertragsende",
            title: "Vertragsende",
            validation: (e) => e.required(),
        }),
        defineField({
            type: "url",
            name: "weblink",
            title: "Weblink",
            description: "Webseite auf der der Chatbot veröffentlicht wird",
            validation: (e) => e.required().uri({ allowRelative: false, scheme: ['http', 'https'] }),
        }),
        defineField({
            type: "object",
            name: "botpress",
            title: "Botpress",
            fields: [
                defineField({
                    type: "text",
                    name: "embedCode",
                    title: "Botpress Embed Code",
                }),
                defineField({
                    type: "string",
                    name: "shareableLink",
                    title: "Teilbarer Link",
                }),
                defineField({
                    type: "string",
                    name: "clientId",
                    title: "Botpress ClientId",
                }),
                defineField({
                    type: "string",
                    name: "personalAccessToken",
                    title: "Botpress PersonalAccessToken",
                }),
                defineField({
                    type: "string",
                    name: "workspaceId",
                    title: "Workspace Id",
                }),
                defineField({
                    type: "string",
                    name: "botId",
                    title: "Bot Id",
                }),
            ],
        }),
    ],
});