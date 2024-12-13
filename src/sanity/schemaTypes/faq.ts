import { defineField, defineType } from 'sanity';

export const faq = defineType({
    type: 'document',
    name: 'faq',
    title: 'FAQ',
    fields: [
        defineField({
            type: 'string',
            name: 'question',
            title: 'Frage',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            type: 'text',
            name: 'answer',
            title: 'Antwort',
            validation: (Rule) => Rule.required(),
        }),
    ],
});