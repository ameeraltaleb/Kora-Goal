const INDEXNOW_KEY = '5f39a48972ca416ab0c9cf9dc0ee4eb8';
const INDEXNOW_KEY_LOCATION = `https://kora-goal.vercel.app/${INDEXNOW_KEY}.txt`;
const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/IndexNow';

export async function submitToIndexNow(urls: string[]) {
  if (!urls || urls.length === 0) return;

  const payload = {
    host: 'kora-goal.vercel.app',
    key: INDEXNOW_KEY,
    keyLocation: INDEXNOW_KEY_LOCATION,
    urlList: urls,
  };

  try {
    const res = await fetch(INDEXNOW_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      console.error(`IndexNow submission failed with status ${res.status}:`, await res.text());
    } else {
      console.log(`Successfully submitted ${urls.length} URLs to IndexNow`);
    }
  } catch (err) {
    console.error('Failed to submit to IndexNow API:', err);
  }
}
