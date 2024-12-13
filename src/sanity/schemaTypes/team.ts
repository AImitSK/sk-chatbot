import { defineField, defineType } from 'sanity';

export const team = defineType({
    type: "document",
    name: "team",
    title: "Team",
    fields: [
        defineField({
            type: "string",
            name: "name",
            title: "Name",
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            type: "string",
            name: "title",
            title: "Titel",
        }),
        defineField({
            type: "string",
            name: "role",
            title: "Rolle",
        }),
        defineField({
            type: "string",
            name: "email",
            title: "E-Mail",
            validation: (Rule) => Rule.required().email(),
        }),
        defineField({
            type: "string",
            name: "telephone",
            title: "Telefon",
        }),
        defineField({
            type: "image",
            name: "profileImage",
            title: "Profilbild",
            options: {
                hotspot: true,
            },
            fields: [
                {
                    name: "alt",
                    type: "string",
                    title: "Alternative Text",
                    description: "Wichtig für SEO und Barrierefreiheit.",
                }
            ]
        }),
    ],
});