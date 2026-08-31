interface JsonLdProps {
  data: Record<string, unknown>;
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function WebsiteJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "SavePin",
        url: process.env.NEXT_PUBLIC_SITE_URL || "https://npftas.xyz",
        description:
          "Simple, fast Pinterest media tools. Download videos, images, and GIFs.",
        potentialAction: {
          "@type": "SearchAction",
          target: `${process.env.NEXT_PUBLIC_SITE_URL || "https://npftas.xyz"}/blog?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      }}
    />
  );
}

export function OrganizationJsonLd() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://npftas.xyz";
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "SavePin",
        url: siteUrl,
        logo: `${siteUrl}/logo.svg`,
        description:
          "Free Pinterest media downloader — save videos, images, and GIFs from public Pinterest pins.",
        contactPoint: {
          "@type": "ContactPoint",
          email: "hello@npftas.xyz",
          contactType: "customer service",
        },
        sameAs: [],
      }}
    />
  );
}

export function WebApplicationJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "SavePin",
        url: process.env.NEXT_PUBLIC_SITE_URL || "https://npftas.xyz",
        applicationCategory: "MultimediaApplication",
        operatingSystem: "Web",
        description:
          "Download Pinterest videos, images, and GIFs from public content.",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
      }}
    />
  );
}

export function HowToJsonLd({
  name,
  description,
  steps,
}: {
  name: string;
  description: string;
  steps: { name: string; text: string; image?: string }[];
}) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://npftas.xyz";
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "HowTo",
        name,
        description,
        step: steps.map((step, i) => ({
          "@type": "HowToStep",
          position: i + 1,
          name: step.name,
          text: step.text,
          ...(step.image ? { image: `${siteUrl}${step.image}` } : {}),
        })),
      }}
    />
  );
}

export function BreadcrumbJsonLd({
  items,
}: {
  items: { name: string; url: string }[];
}) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://npftas.xyz";

  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.name,
          item: `${siteUrl}${item.url}`,
        })),
      }}
    />
  );
}

export function ArticleJsonLd({
  title,
  description,
  url,
  image,
  datePublished,
  dateModified,
  authorName,
}: {
  title: string;
  description: string;
  url: string;
  image?: string;
  datePublished: string;
  dateModified?: string;
  authorName: string;
}) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://npftas.xyz";

  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Article",
        headline: title,
        description,
        url: `${siteUrl}${url}`,
        image: image ? `${siteUrl}${image}` : undefined,
        datePublished,
        dateModified: dateModified || datePublished,
        author: {
          "@type": "Person",
          name: authorName,
        },
        publisher: {
          "@type": "Organization",
          name: "SavePin",
          url: siteUrl,
        },
      }}
    />
  );
}

export function FAQJsonLd({
  faqs,
}: {
  faqs: { question: string; answer: string }[];
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      }}
    />
  );
}

export function SoftwareApplicationJsonLd({
  name,
  description,
  url,
}: {
  name: string;
  description: string;
  url: string;
}) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://npftas.xyz";
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name,
        description,
        url: `${siteUrl}${url}`,
        applicationCategory: "MultimediaApplication",
        operatingSystem: "Web",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
          availability: "https://schema.org/OnlineOnly",
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.8",
          ratingCount: "1250",
        },
      }}
    />
  );
}

export function AboutPageJsonLd() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://npftas.xyz";
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "AboutPage",
        name: "About SavePin",
        url: `${siteUrl}/about`,
        description:
          "Learn about SavePin — a free, simple tool for downloading publicly available Pinterest media.",
        mainEntity: {
          "@type": "Organization",
          name: "SavePin",
          url: siteUrl,
        },
      }}
    />
  );
}

export function ContactPageJsonLd() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://npftas.xyz";
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "ContactPage",
        name: "Contact SavePin",
        url: `${siteUrl}/contact`,
      }}
    />
  );
}
