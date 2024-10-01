import * as cheerio from "cheerio";
import { type NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { env } from "@/env";
import { users, userSessions } from "@/server/db/schema";
import { db } from "@/server/db";

import { createId } from "@paralleldrive/cuid2";
import { encryptData } from "@/lib/encryption";

const ssoLoginHandler = async (req: NextRequest) => {
  try {
    const { laravelSession, xsrfToken, casAuth } = getSessionParams(req);
    if (!laravelSession || !xsrfToken || !casAuth) {
      return NextResponse.redirect(req.url);
    }

    const { name, nim } = await fetchUserInfoFromSPOT(
      laravelSession,
      xsrfToken,
      casAuth,
    );
    if (!name || !nim) {
      return NextResponse.redirect(req.url);
    }

    const user = await getOrCreateUser(nim, name);
    await updateUserSession(user.id, laravelSession, xsrfToken, casAuth);

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
  casAuth: string,
) {
  const existingSession = (
    await db.select().from(userSessions).where(eq(userSessions.userId, userId))
  ).at(0);

  if (existingSession) {
    await db
      .update(userSessions)
      .set({ laravelSession, xsrfToken, casAuth })
      .where(eq(userSessions.id, existingSession.id));
  } else {
    await db.insert(userSessions).values({
      id: createId(),
      laravelSession,
      xsrfToken,
      casAuth,
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
  const encryptedData = encryptData({
    userId,
    laravelSession,
    xsrfToken,
    casAuth,
  });

  const url = new URL(env.NEXT_PUBLIC_BASE_URL + "/dashboard");
  url.searchParams.set("data", encryptedData);

  const response = NextResponse.redirect(url);

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

async function fetchUserInfoFromSPOT(
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

  // Add timeout logic
  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error("SPOT takes too long to respond")), 6000),
  );

  try {
    const spotResponse = await Promise.race([
      fetch(url, { headers, method: "GET" }),
      timeoutPromise,
    ]);

    if (!(spotResponse instanceof Response)) {
      throw new Error("SPOT response is not a valid Response object");
    }

    const spotBody = await spotResponse.text();

    if (typeof spotBody !== "string") {
      throw new Error("SPOT response body is not a valid string");
    }

    const $ = cheerio.load(spotBody);
    const profileText = $(".user-profile .profile-text").text().trim();
    const profileParts = profileText.split(/\s+/);
    const nim = profileParts.pop();
    const name = profileParts.join(" ");

    return { name, nim };
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "SPOT takes too long to respond"
    ) {
      throw error;
    }
    // Re-throw other errors
    throw new Error("Failed to fetch user info from SPOT");
  }
}

export { ssoLoginHandler as GET };
