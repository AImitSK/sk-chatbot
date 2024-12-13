import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { MinusSmallIcon, PlusSmallIcon } from '@heroicons/react/24/outline';

// Definiere den Typ für FAQs
interface FAQ {
    question: string;
    answer: string;
}

// Typ für die Props der FAQ-Komponente
interface FAQProps {
    faqs: FAQ[];
}

export default function FAQ({ faqs }: FAQProps) {
    return (
        <div className="bg-white">
            <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-0 lg:py-40">
                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="lg:col-start-1 lg:col-span-2">
                        <h2 className="text-4xl font-semibold tracking-tight text-gray-900 sm:text-4xl">Häufig gestellte Fragen</h2>
                        <p className="mt-4 text-lg text-gray-600">Find answers to some of the most commonly asked questions below.</p>
                    </div>
                </div>
                <div className="mt-10 divide-y divide-gray-200">
                    {faqs.map((faq: FAQ) => (
                        <Disclosure key={faq.question} as="div" className="pt-6">
                            <dt>
                                <DisclosureButton className="group flex w-full items-start justify-between text-left text-gray-900">
                                    <span className="text-base font-semibold">{faq.question}</span>
                                    <span className="ml-6 flex h-7 items-center">
                                        <PlusSmallIcon aria-hidden="true" className="h-6 w-6 group-data-[open]:hidden" />
                                        <MinusSmallIcon aria-hidden="true" className="h-6 w-6 group-[&:not([data-open])]:hidden" />
                                    </span>
                                </DisclosureButton>
                            </dt>
                            <DisclosurePanel as="dd" className="mt-2 pr-12">
                                <p className="text-base text-gray-600">{faq.answer}</p>
                            </DisclosurePanel>
                        </Disclosure>
                    ))}
                </div>
            </div>
        </div>
    );
}