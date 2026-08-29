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
        url: process.env.NEXT_PUBLIC_SITE_URL || "https://savepin.vercel.app",
        description:
          "Simple, fast Pinterest media tools. Download videos, images, and GIFs.",
        potentialAction: {
          "@type": "SearchAction",
          target: `${process.env.NEXT_PUBLIC_SITE_URL || "https://savepin.vercel.app"}/blog?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      }}
    />
  );
}

export function OrganizationJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "SavePin",
        url: process.env.NEXT_PUBLIC_SITE_URL || "https://savepin.vercel.app",
        logo: `${process.env.NEXT_PUBLIC_SITE_URL || "https://savepin.vercel.app"}/logo.svg`,
        description:
          "Free Pinterest media downloader — save videos, images, and GIFs from public Pinterest pins.",
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
        url: process.env.NEXT_PUBLIC_SITE_URL || "https://savepin.vercel.app",
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
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://savepin.vercel.app";
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
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://savepin.vercel.app";

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
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://savepin.vercel.app";

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
