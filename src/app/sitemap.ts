import { supabase } from '@/lib/supabase';
import type { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://kora-goal.vercel.app';

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'always', priority: 1 },
    { url: `${baseUrl}/news`, lastModified: new Date(), changeFrequency: 'hourly', priority: 0.9 },
    { url: `${baseUrl}/standings`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/privacy-policy`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${baseUrl}/dmca`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
  ];

  // Dynamic news pages
  const { data: newsItems } = await supabase
    .from('news')
    .select('slug, created_at')
    .order('created_at', { ascending: false })
    .limit(100);

  const newsPages: MetadataRoute.Sitemap = (newsItems || []).map((item: any) => ({
    url: `${baseUrl}/news/${item.slug}`,
    lastModified: new Date(item.created_at),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // Dynamic match pages
  const { data: matches } = await supabase
    .from('matches')
    .select('id, match_time')
    .order('match_time', { ascending: false })
    .limit(50);

  const matchPages: MetadataRoute.Sitemap = (matches || []).map((m: any) => ({
    url: `${baseUrl}/match/${m.id}`,
    lastModified: new Date(m.match_time),
    changeFrequency: 'daily' as const,
    priority: 0.6,
  }));

  return [...staticPages, ...newsPages, ...matchPages];
}
