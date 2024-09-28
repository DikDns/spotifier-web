import { type NextRequest, NextResponse } from "next/server";

import * as cheerio from "cheerio";
import { eq } from "drizzle-orm";

import { env } from "@/env";
import { users, userSessions } from "@/server/db/schema";
import { db } from "@/server/db";

import { createId } from "@paralleldrive/cuid2";

const ssoLoginHandler = async (req: NextRequest) => {
  try {
    const { laravelSession, xsrfToken, casAuth } = getSessionParams(req);
    if (!laravelSession || !xsrfToken || !casAuth) {
      return NextResponse.redirect(req.url);
    }

    const { name, nim } = await fetchUserInfo(
      laravelSession,
      xsrfToken,
      casAuth,
    );
    if (!name || !nim) {
      return NextResponse.redirect(req.url);
    }

    const user = await getOrCreateUser(nim, name);
    await updateUserSession(user.id, laravelSession, xsrfToken);

    return createSuccessResponse(user.id, laravelSession, xsrfToken, casAuth);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error },
      { status: 500 },
    );
  }
};

function getSessionParams(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  return {
    laravelSession: params.get("laravel_session"),
    xsrfToken: params.get("XSRF-TOKEN"),
    casAuth: params.get("CASAuth"),
  };
}

async function fetchUserInfo(
  laravelSession: string,
  xsrfToken: string,
  casAuth: string,
) {
  const headers = {
    Cookie: `laravel_session=${laravelSession};XSRF-TOKEN=${xsrfToken};CASAuth=${casAuth}`,
    Host: "spot.upi.edu",
    Connection: "keep-alive",
    Accept: "*/*",
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
  };

  const url = env.NEXT_PUBLIC_SPOT_URL + "/mhs";
  const spotResponse = await fetch(url, { headers, method: "GET" });
  const spotBody = await spotResponse.text();

  const $ = cheerio.load(spotBody);
  const profileText = $(".user-profile .profile-text").text().trim();
  const profileParts = profileText.split(/\s+/);
  const nim = profileParts.pop();
  const name = profileParts.join(" ");

  return { name, nim };
}

async function getOrCreateUser(nim: string, name: string) {
  const existingUser = (
    await db.select().from(users).where(eq(users.nim, nim))
  ).at(0);
  if (existingUser) return existingUser;

  const newUser = (
    await db.insert(users).values({ id: createId(), nim, name }).returning()
  ).at(0);
  if (!newUser) throw new Error("Failed to create new user");

  return newUser;
}

async function updateUserSession(
  userId: string,
  laravelSession: string,
  xsrfToken: string,
) {
  const existingSession = (
    await db.select().from(userSessions).where(eq(userSessions.userId, userId))
  ).at(0);

  if (existingSession) {
    await db
      .update(userSessions)
      .set({ laravelSession, xsrfToken })
      .where(eq(userSessions.id, existingSession.id));
  } else {
    await db.insert(userSessions).values({
      id: createId(),
      laravelSession,
      xsrfToken,
      userId,
    });
  }
}

function createSuccessResponse(
  userId: string,
  laravelSession: string,
  xsrfToken: string,
  casAuth: string,
) {
  const response = NextResponse.redirect(env.NEXT_PUBLIC_BASE_URL);
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    maxAge: 30 * 24 * 60 * 60, // 30 days
    path: "/",
  };

  response.cookies.set("userId", userId, cookieOptions);
  response.cookies.set("laravel_session", laravelSession, cookieOptions);
  response.cookies.set("XSRF-TOKEN", xsrfToken, cookieOptions);
  response.cookies.set("CASAuth", casAuth, cookieOptions);

  return response;
}

export { ssoLoginHandler as GET };
