import { eq } from "drizzle-orm";
import { cookies } from "next/headers";

import { db } from "@/server/db";
import { userSessions, users } from "@/server/db/schema";
import { env } from "@/env";
import { decryptData } from "@/lib/encryption";

export async function getServerSession(data?: string) {
  try {
    const cookie = cookies();
    const params = data ? decryptData(data) : {};

    console.log("params: \n", params);

    const laravelSession =
      cookie.get("laravel_session")?.value ?? params?.laravelSession;
    const userId = cookie.get("userId")?.value ?? params?.userId;
    const xsrfToken = cookie.get("XSRF-TOKEN")?.value ?? params?.xsrfToken;
    const casAuth = cookie.get("CASAuth")?.value ?? params?.casAuth;

    if (!laravelSession || !userId || !xsrfToken || !casAuth) {
      return null;
    }

    const isCookiesValid = await checkCookies(
      laravelSession,
      xsrfToken,
      casAuth,
    );

    if (!isCookiesValid) {
      return null;
    }

    const user = (
      await db
        .select()
        .from(users)
        .where(eq(users.id, userId ?? ""))
    ).at(0);

    if (!user) {
      return null;
    }

    const session = (
      await db
        .select()
        .from(userSessions)
        .where(eq(userSessions.userId, user.id))
    ).at(0);

    if (!session) {
      return null;
    }

    if (
      session.laravelSession !== laravelSession ||
      session.xsrfToken !== xsrfToken
    ) {
      await db
        .update(userSessions)
        .set({
          laravelSession,
          xsrfToken,
        })
        .where(eq(userSessions.id, session.id));
    }

    return {
      user: {
        id: user.id,
        name: user.name,
        nim: user.nim,
      },
      session: {
        id: session.id,
        laravelSession: laravelSession,
        xsrfToken: xsrfToken,
      },
    };
  } catch (error) {
    console.error("Error getting server session: ", error);
    return null;
  }
}

export async function checkCookies(
  laravelSession: string,
  xsrfToken: string,
  casAuth: string,
) {
  try {
    const headers = {
      Cookie: `laravel_session=${laravelSession};XSRF-TOKEN=${xsrfToken};CASAuth=${casAuth}`,
      Host: "spot.upi.edu",
      Connection: "keep-alive",
      Accept: "*/*",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
    };
    const url = env.NEXT_PUBLIC_SPOT_URL + "/mhs";
    const spotResponse = await fetch(url, {
      headers,
      method: "GET",
      redirect: "manual",
    });

    if (spotResponse.status !== 200) {
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error checking cookies: ", error);
    return false;
  }
}
