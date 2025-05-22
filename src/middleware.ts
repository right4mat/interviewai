import { NextResponse, NextRequest } from 'next/server'
import acceptLanguage from 'accept-language'
import { fallbackLng, languages, cookieName, headerName } from './i18n/settings'

acceptLanguage.languages(languages)

export const config = {
  // Avoid matching for static files, API routes, etc.
  matcher: ['/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js|site.webmanifest).*)']
}

export function middleware(req: NextRequest) {
  // Ignore paths with "icon" or "chrome"
  if (req.nextUrl.pathname.indexOf('icon') > -1 || req.nextUrl.pathname.indexOf('chrome') > -1) return NextResponse.next()
  
  let lng
  // Try to get language from cookie
  const cookie = req.cookies.get(cookieName)
  if (cookie?.value) lng = acceptLanguage.get(cookie.value)
  // If no cookie, check the Accept-Language header
  if (!lng) {
    const acceptLangHeader = req.headers.get('Accept-Language')
    if (acceptLangHeader) lng = acceptLanguage.get(acceptLangHeader)
  }
  // Default to fallback language if still undefined
  if (!lng) lng = fallbackLng

  // Check if the language is already in the path
  const lngInPath = languages.find(loc => req.nextUrl.pathname.startsWith(`/${loc}`))
  const headers = new Headers(req.headers)
  headers.set(headerName, lngInPath || lng)

  // If the language is not in the path, redirect to include it
  if (
    !lngInPath &&
    !req.nextUrl.pathname.startsWith('/_next')
  ) {
    return NextResponse.redirect(new URL(`/${lng}${req.nextUrl.pathname}${req.nextUrl.search}`, req.url))
  }

  // If a referer exists, try to detect the language from there and set the cookie accordingly
  const referer = req.headers.get('referer')
  if (referer) {
    const refererUrl = new URL(referer)
    const lngInReferer = languages.find((l) => refererUrl.pathname.startsWith(`/${l}`))
    const response = NextResponse.next({ headers })
    if (lngInReferer) response.cookies.set(cookieName, lngInReferer)
    return response
  }

  return NextResponse.next({ headers })
}