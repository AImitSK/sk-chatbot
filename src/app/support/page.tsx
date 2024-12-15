import Team from '@/components/support/team';
import FAQ from '@/components/support/faq';
import { client } from '@/sanity/client';
import SupportForm from '@/components/support/supportForm'

export default async function SupportPage() {
    // Query für Team-Daten
    const teamQuery = `
        *[_type == "team"] {
            name,
            title,
            role,
            email,
            telephone,
            "imageUrl": profileImage.asset->url,
            "altText": profileImage.alt
        }
    `;
    const people = await client.fetch(teamQuery);

    // Query für FAQ-Daten
    const faqQuery = `
        *[_type == "faq"] {
            question,
            answer
        }
    `;
    const faqs = await client.fetch(faqQuery);

    return (
        <div className="container mx-auto py-12">

            {/* Team-Komponente */}
            <Team people={people} />

            {/* Support Formulare */}
            <SupportForm />

            {/* FAQ-Komponente */}
            <FAQ faqs={faqs} />

        </div>
    );
}