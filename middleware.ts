import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isValidPassword } from "./lib/isValid";

export async function middleware(req: NextRequest) {
  if ((await isAuthenticated(req)) === false) {
    return new NextResponse("Unauthorized", {
      status: 401,
      headers: { "WWW-Authenticate": "Basic" },
    });
  }
}

export const config = {
  matcher: ["/admin/:path*"],
};

async function isAuthenticated(req: NextRequest) {
  const authHeader =
    req.headers.get("Authorization") || req.headers.get("authorization");
  if (authHeader == null) return false;

  // console.log(authHeader);
  const [username, password] = Buffer.from(authHeader.split(" ")[1], "base64")
    .toString()
    .split(":");

  return (
    username === process.env.ADMIN_USERNAME &&
    isValidPassword(password, process.env.ADMIN_PASSWORD as string)
  );
}
