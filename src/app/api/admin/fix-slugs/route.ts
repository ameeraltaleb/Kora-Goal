import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { slugify } from '@/lib/utils';

export async function GET() {
  try {
    const { data: news } = await supabase
      .from('news')
      .select('id, title')
      .is('slug', null);

    if (!news || news.length === 0) {
      return NextResponse.json({ message: 'No news with null slugs found' });
    }

    let updated = 0;
    for (const item of news) {
      const slug = `${slugify(item.title)}-${item.id}`;
      await supabase
        .from('news')
        .update({ slug })
        .eq('id', item.id);
      updated++;
    }

    return NextResponse.json({ success: true, fixedCount: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
