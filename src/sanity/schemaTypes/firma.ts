import { defineField, defineType } from 'sanity';

export const Firmenadresse = defineType({
    type: "document",
    name: "Firma",
    title: "Firma",
    fields: [
        defineField({
            type: "string",
            name: "Name",
            title: "Firmenname",
            validation: (e) => e.required(),
        }),
        defineField({
            type: "string",
            name: "Street",
            title: "Straße",
            validation: (e) => e.required(),
        }),
        defineField({
            type: "string",
            name: "City",
            title: "Stadt",
            validation: (e) => e.required(),
        }),
        defineField({
            type: "string",
            name: "ZipCode",
            title: "Postleitzahl",
            validation: (e) => e.required(),
        }),
        defineField({
            type: "string",
            name: "Country",
            title: "Land",
            validation: (e) => e.required(),
        }),
        defineField({
            type: "string",
            name: "TaxNumber",
            title: "Steuernummer",
            validation: (e) => e.required(),
        }),
        defineField({
            type: "TechnischerAnsprechpartner",
            name: "TechnischerAnsprechpartner",
            title: "Technischer Ansprechpartner",
        }),
        defineField({
            type: "buchhaltung",
            name: "buchhaltung",
            title: "Buchhaltung",
        }),
    ],
});

export const TechnischerAnsprechpartner = defineType({
    type: "object",
    name: "TechnischerAnsprechpartner",
    title: "Technischer Ansprechpartner",
    fields: [
        defineField({
            type: "string",
            name: "Name",
            title: "Vollständiger Name",
            validation: (e) => e.required(),
        }),
        defineField({
            type: "string",
            name: "Email",
            title: "E-Mail-Adresse",
            validation: (e) => e.required(),
        }),
        defineField({ type: "string", name: "Phone", title: "Telefonnummer" }),
    ],
});

export const buchhaltung = defineType({
    type: "object",
    name: "buchhaltung",
    title: "Buchhaltung",
    fields: [
        defineField({
            type: "string",
            name: "Name",
            title: "Vollständiger Name",
            validation: (e) => e.required(),
        }),
        defineField({
            type: "string",
            name: "Email",
            title: "E-Mail-Adresse",
            validation: (e) => e.required(),
        }),
        defineField({ type: "string", name: "Phone", title: "Telefonnummer" }),
    ],
});