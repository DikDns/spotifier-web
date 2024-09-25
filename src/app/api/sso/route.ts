import { type NextRequest, NextResponse } from "next/server";

import * as cheerio from "cheerio";
import { eq } from "drizzle-orm";

import { env } from "~/env";
import { users, userSessions } from "~/server/db/schema";
import { db } from "~/server/db";

import { createId } from "@paralleldrive/cuid2";

const ssoLoginHandler = async (req: NextRequest) => {
  try {
    const params = req.nextUrl.searchParams;
    const laravelSession = params.get("laravel_session");
    const xsrfToken = params.get("XSRF-TOKEN");
    const casAuth = params.get("CASAuth");

    if (!laravelSession || !xsrfToken || !casAuth) {
      return NextResponse.redirect(req.url);
    }

    const headers = {
      Cookie: `laravel_session=${laravelSession};XSRF-TOKEN=${xsrfToken};CASAuth=${casAuth}`,
      Host: "spot.upi.edu",
      Connection: "keep-alive",
      Accept: "*/*",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
    };

    const url = env.NEXT_PUBLIC_SPOT_URL + "/mhs";
    const response = await fetch(url, {
      headers: headers,
      method: "GET",
    });

    const body = await response.text();

    // Parse the HTML body
    const $ = cheerio.load(body);

    // Extract and split the name and NIM
    const profileText = $(".user-profile .profile-text").text().trim();
    const profileParts = profileText.split(/\s+/);
    const nim = profileParts.pop();
    const name = profileParts.join(" ");

    if (!name || !nim) {
      return NextResponse.redirect(req.url);
    }

    const user = (await db.select().from(users).where(eq(users.nim, nim))).at(
      0,
    );

    if (!user) {
      const newUser = (
        await db
          .insert(users)
          .values({
            id: createId(),
            nim,
            name,
          })
          .returning()
      ).at(0);

      if (!newUser) {
        return NextResponse.redirect(req.url);
      }

      await db.insert(userSessions).values({
        id: createId(),
        laravelSession,
        xsrfToken,
        userId: newUser.id,
      });

      return NextResponse.redirect(env.NEXT_PUBLIC_BASE_URL);
    }

    const userSession = (
      await db
        .select()
        .from(userSessions)
        .where(eq(userSessions.userId, user.id))
    ).at(0);

    if (!userSession) {
      await db.insert(userSessions).values({
        id: createId(),
        laravelSession,
        xsrfToken,
        userId: user.id,
      });
    } else {
      await db
        .update(userSessions)
        .set({
          laravelSession,
          xsrfToken,
        })
        .where(eq(userSessions.id, userSession.id));
    }

    return NextResponse.redirect(env.NEXT_PUBLIC_BASE_URL);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error },
      { status: 500 },
    );
  }
};

export { ssoLoginHandler as GET };
