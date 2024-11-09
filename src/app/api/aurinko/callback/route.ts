import { exchangeCodeForAccessToken, getAccountDetails } from "@/lib/aurinko";
import { db } from "@/server/db";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { waitUntil } from "@vercel/functions"
import axios from "axios";

export const GET = async (req: NextRequest) => {
  const { userId } = await auth();
  console.log("userId:", userId);

  if (!userId)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const params = req.nextUrl.searchParams;
  const status = params.get('status');

  // Check if status is success
  if (status !== 'success') {
    return NextResponse.json({ message: "Unable to link account" }, { status: 400 });
  }

  const code = params.get('code');
  if (!code) return NextResponse.json({ message: "No code" }, { status: 400 });

  const token = await exchangeCodeForAccessToken(code);
  console.log("Token :", token);

  if (!token) return NextResponse.json({ message: "No Token" }, { status: 400 });

  console.log("Going for account details");
  const accountDetails = await getAccountDetails(token.accessToken);
  console.log("Account Details:", accountDetails);


  await db.account.upsert({
    where: { id: token.accountId.toString() },
    update: {
      token: token.accessToken,
    },
    create: {
      id: token.accountId.toString(),
      userId,
      token: token.accessToken,
      provider: 'Aurinko',
      emailAddress: accountDetails.email,
      name: accountDetails.name
    },
  })

  // after linking the account trigger the initial sync mails
  // later it sends a deltaToken and gets the mails

  waitUntil(
    axios.post(`${process.env.NEXT_PUBLIC_URL}/api/initial-sync`, {
      accountId: token.accountId.toString(),
      userId
    }).then((res) => {
      console.log("Initial sync triggered")
    }).catch(err => {
      console.error("Error in initial sync", err);
    })
  )

  return NextResponse.redirect(new URL("/mail", req.url));
};
