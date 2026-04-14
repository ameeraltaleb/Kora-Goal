import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  
  // Skip middleware for internal Next.js requests and static assets
  if (url.pathname.startsWith('/_next') || url.pathname.includes('.')) {
    return NextResponse.next();
  }

  const basicAuth = req.headers.get('authorization');
  const user = process.env.ADMIN_USER || 'admin';
  const pwd = process.env.ADMIN_PASSWORD || 'admin';

  if (basicAuth) {
    try {
      const authValue = basicAuth.split(' ')[1];
      const [reqUser, reqPwd] = atob(authValue).split(':');

      if (reqUser === user && reqPwd === pwd) {
        return NextResponse.next();
      }
    } catch (e) {
      console.error('Basic Auth Decoding Error:', e);
    }
  }

  // If it's a prefetch request or an internal Next.js RSC fetch, returning 401 WWW-Authenticate might break the Next.js router.
  // Instead, we just return a normal 401 without the popup for background requests.
  const isPrefetch = req.headers.get('purpose') === 'prefetch';
  const isRSC = req.headers.get('rsc') === '1';

  if (isPrefetch || (isRSC && !url.pathname.includes('/api/'))) {
    return new NextResponse('Unauthorized area', { status: 401 });
  }

  return new NextResponse('Auth Required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Secure Kora Goal Admin Area"',
    },
  });
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
