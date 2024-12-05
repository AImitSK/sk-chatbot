import { defineField, defineType } from 'sanity';

export const userType = defineType({
    name: 'user',
    title: 'User',
    type: 'document',
    fields: [
        defineField({
            name: 'username',
            title: 'Username',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'email',
            title: 'Email',
            type: 'string',
            validation: (Rule) => Rule.required().email(),
        }),
        defineField({
            name: 'password',
            title: 'Password',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
    ],
});
