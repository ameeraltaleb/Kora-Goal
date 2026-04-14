const fs = require('fs');
const path = require('path');

async function testGemini() {
  const envPath = path.resolve('.env.local');
  const envContent = fs.readFileSync(envPath, 'utf-8');
  let apiKey = '';
  
  envContent.split(/\r?\n/).forEach(line => {
    if (line.startsWith('GEMINI_API_KEY=')) {
      apiKey = line.split('=')[1].trim();
    }
  });

  console.log("Testing with API Key (masked):", apiKey.substring(0, 10));

  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
  try {
    const res = await fetch(url);
    const json = await res.json();
    console.log(JSON.stringify(json, null, 2));
  } catch (err) {
    console.error(err);
  }
}

testGemini();
