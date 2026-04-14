const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function check() {
  console.log('Checking Supabase Matches...');
  const { data, error } = await supabase.from('matches').select('id, home_team, away_team').limit(5);
  if (error) {
    console.error('Error fetching matches:', error);
  } else {
    console.log('Matches found:', data.length);
    data.forEach(m => console.log(`- ${m.home_team} vs ${m.away_team}`));
  }
  
  const { data: news } = await supabase.from('news').select('id').limit(1);
  console.log('News items found:', news?.length || 0);
}

check();
