import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  // We only run this on /admin and /api/admin paths, defined in the matcher
  const basicAuth = req.headers.get('authorization');
  const url = req.nextUrl;

  // Set credentials either from env or use defaults (not recommended for prod but acts as fallback)
  const user = process.env.ADMIN_USER || 'admin';
  const pwd = process.env.ADMIN_PASSWORD || 'admin';

  if (basicAuth) {
    const authValue = basicAuth.split(' ')[1];
    const [reqUser, reqPwd] = atob(authValue).split(':');

    if (reqUser === user && reqPwd === pwd) {
      return NextResponse.next();
    }
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
