import { defineField, defineType } from 'sanity';

export const vertragsmodelle = defineType({
  type: "document",
  name: "vertragsmodelle",
  title: "Vertragsmodelle",
  fields: [
    defineField({
      type: "string",
      name: "name",
      title: "Name",
      validation: (e) => e.required(),
    }),
    defineField({
      type: "number",
      name: "freeKiSpend",
      title: "Free KI-Spend",
      description: "EUR im Monat",
      validation: (e) => e.required(),
    }),
    defineField({
      type: "boolean",
      name: "hitlFunktion",
      title: "HITL-Funktion",
      description: "HITL-Funktion für Live-Chat mit Support",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      type: "boolean",
      name: "emailSupport",
      title: "Email Support",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      type: "boolean",
      name: "telefonSupport",
      title: "Telefon Support",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      type: "number",
      name: "preis",
      title: "Preis",
      description: "EUR im Monat",
      validation: (e) => e.required(),
    }),
  ],
});


