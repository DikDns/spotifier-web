import { eq } from "drizzle-orm";
import { cookies } from "next/headers";

import { db } from "@/server/db";
import { userSessions, users } from "@/server/db/schema";
import { env } from "@/env";
import { decryptData } from "@/lib/encryption";

export type Session = {
  user: {
    id: string;
    name: string | null;
    nim: string | null;
  };
  session: {
    id: string;
    laravelSession: string;
    xsrfToken: string;
    casAuth: string;
  };
};

export async function getServerSession(data?: string) {
  try {
    const sessionData = await getSessionData(data);
    if (!sessionData) return null;

    const { laravelSession, userId, xsrfToken, casAuth } = sessionData;
    if (!laravelSession || !xsrfToken || !casAuth || !userId) return null;

    if (!(await checkCookies(laravelSession, xsrfToken, casAuth))) {
      return null;
    }

    const user = await getUserById(userId);
    if (!user) return null;

    const session = await getUserSession(user.id);
    if (!session) return null;

    await updateSessionIfNeeded(session, laravelSession, xsrfToken, casAuth);

    return {
      user: { id: user.id, name: user.name, nim: user.nim },
      session: { id: session.id, laravelSession, xsrfToken, casAuth },
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

    // Create a promise that rejects after 5 seconds
    const fetchWithTimeout = (url: string, options: RequestInit) => {
      return Promise.race([
        fetch(url, options),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Timeout")), 5000),
        ),
      ]);
    };

    const spotResponse = await fetchWithTimeout(url, {
      headers,
      method: "GET",
      redirect: "manual",
    });

    if (!(spotResponse instanceof Response)) {
      throw new Error("SPOT response is not a valid Response object");
    }

    if (spotResponse.status !== 200) {
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error checking cookies: ", error);
    return false;
  }
}

async function getSessionData(data?: string) {
  const cookie = cookies();
  const params = data ? decryptData(data) : {};
  const laravelSession =
    cookie.get("laravel_session")?.value ?? params?.laravelSession;
  const userId = cookie.get("userId")?.value ?? params?.userId;
  const xsrfToken = cookie.get("XSRF-TOKEN")?.value ?? params?.xsrfToken;
  const casAuth = cookie.get("CASAuth")?.value ?? params?.casAuth;

  const sessionData = {
    laravelSession,
    userId,
    xsrfToken,
    casAuth,
  };

  return sessionData;
}

async function getUserById(userId: string) {
  return (await db.select().from(users).where(eq(users.id, userId))).at(0);
}

async function getUserSession(userId: string) {
  return (
    await db.select().from(userSessions).where(eq(userSessions.userId, userId))
  ).at(0);
}

async function updateSessionIfNeeded(
  session: typeof userSessions.$inferSelect,
  laravelSession: string,
  xsrfToken: string,
  casAuth: string,
) {
  if (
    session.laravelSession !== laravelSession ||
    session.xsrfToken !== xsrfToken ||
    session.casAuth !== casAuth
  ) {
    await db
      .update(userSessions)
      .set({ laravelSession, xsrfToken, casAuth })
      .where(eq(userSessions.id, session.id));
  }
}
