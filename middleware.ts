/**
 *   This is the workaround code to get Prisma and the middle to work on the edge.
 *
 *   Doesn't have to be specifically for private or public routes.
 *   Can be use for anything you want to invoke the middleware.
 *
 *   Middleware works on the edge. When using an adapter like prisma, you need to also create *   a auth.config.js
 */

import NextAuth from "next-auth"
import authConfig from "./auth.config"

const { auth } = NextAuth(authConfig)

import {
    DEFAULT_LOGIN_REDIRECT,
    apiAuthPrefix,
    authRoutes,
    publicRoutes,
} from "@/routes"

/** This function can be marked `async` if using `await` inside */
export default auth((req) => {
    const { nextUrl } = req
    const isLoggedIn = !!req.auth //!! turns var into a boolean
    const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix)
    const isPublicRoute = publicRoutes.includes(nextUrl.pathname)
    const isAuthRoute = authRoutes.includes(nextUrl.pathname)

    if (isApiAuthRoute) {
        return
    }

    if (isAuthRoute) {
        if (isLoggedIn) {
            /**    Pass in nextUrl to turn it into an absolute pathne */
            return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl))
        }
        return
    }

    if (!isLoggedIn && !isPublicRoute) {
        return Response.redirect(new URL("/auth/login", nextUrl))
    }
    return
})

/**
 *   Invokes the middleware on all matching regexp
 *   Having a catch all regex allows you to not have to write down every route, ex: matcher
 */
export const config = {
    //ex: matcher: [''/about/path']
    matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}
