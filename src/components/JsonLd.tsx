import type React from 'react';

interface SportsSiteJsonLdProps {
  name?: string;
  url?: string;
}

export function SportsSiteJsonLd({ name = 'كورة غول', url = 'https://kora-goal.vercel.app' }: SportsSiteJsonLdProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": name,
    "url": url,
    "description": "منصة كورة غول - بث مباشر لمباريات كرة القدم العالمية والعربية",
    "inLanguage": "ar-SA",
    "audience": {
      "@type": "Audience",
      "audienceType": "Sports Fans"
    },
    "publisher": {
      "@type": "Organization",
      "name": name,
      "url": url,
      "logo": {
        "@type": "ImageObject",
        "url": `${url}/logo.png`
      }
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${url}/news?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

interface MatchJsonLdProps {
  homeTeam: string;
  awayTeam: string;
  tournament?: string;
  status?: string;
  score?: string;
  url?: string;
}

export function MatchJsonLd({ homeTeam, awayTeam, tournament, status, score, url }: MatchJsonLdProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    "name": `${homeTeam} ضد ${awayTeam}`,
    "description": `مباراة ${homeTeam} ضد ${awayTeam} في ${tournament || ''}`,
    "sport": "Soccer",
    "startDate": new Date().toISOString(),
    "location": {
      "@type": "Place",
      "name": tournament || "استاد"
    },
    "competitor": [
      {
        "@type": "SportsTeam",
        "name": homeTeam
      },
      {
        "@type": "SportsTeam",
        "name": awayTeam
      }
    ],
    "inLanguage": "ar-SA"
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

interface NewsArticleJsonLdProps {
  title: string;
  description: string;
  publishedDate: string;
  modifiedDate: string;
  url: string;
  image?: string;
  author?: string;
}

export function NewsArticleJsonLd({ title, description, publishedDate, modifiedDate, url, image, author }: NewsArticleJsonLdProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": title,
    "description": description,
    "image": image || `${url}/default-news-image.jpg`,
    "datePublished": publishedDate,
    "dateModified": modifiedDate,
    "author": {
      "@type": "Organization",
      "name": author || "كورة غول"
    },
    "publisher": {
      "@type": "Organization",
      "name": "كورة غول",
      "logo": {
        "@type": "ImageObject",
        "url": `${url}/logo.png`
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": url
    },
    "inLanguage": "ar-SA"
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
