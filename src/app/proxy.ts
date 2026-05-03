import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const acceptLanguage = request.headers.get('accept-language');
  const response = NextResponse.next();
  if (acceptLanguage) {
    response.cookies.set('NEXT_LOCALE', acceptLanguage.split(',')[0].replace(/-.*$/, ""));
  }
  return response;
}