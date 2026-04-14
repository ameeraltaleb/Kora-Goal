// src/app/api/proxy/route.ts
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const targetUrl = searchParams.get('url');

  if (!targetUrl) {
    return NextResponse.json({ error: 'Missing url parameter' }, { status: 400 });
  }

  try {
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': '*/*'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch from target: ${response.status} ${response.statusText}`);
    }

    const data = await response.arrayBuffer(); // Keep data raw for M3U8/TS

    const headers = new Headers();
    headers.set('Access-Control-Allow-Origin', '*');
    
    // Copy content type if available
    const contentType = response.headers.get('content-type');
    if (contentType) headers.set('Content-Type', contentType);

    return new NextResponse(data, {
      status: 200,
      headers
    });
  } catch (error: any) {
    console.error("Proxy Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function OPTIONS() {
  const headers = new Headers();
  headers.set('Access-Control-Allow-Origin', '*');
  headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  return new NextResponse(null, { status: 204, headers });
}
