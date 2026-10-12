import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type Body = {
  firstName?: string;
  lastName?: string;
  company?: string;
  email?: string;
  phone?: string;
  message?: string;
  agree?: boolean;
};

export async function POST(req: Request) {
  try {
    const body: Body = await req.json();
    const { firstName, lastName, company, email, phone, message, agree } =
      body || {};

    if (
      !firstName ||
      !lastName ||
      !company ||
      !email ||
      !phone ||
      !message ||
      !agree
    ) {
      return NextResponse.json(
        { error: "Alle velden zijn verplicht." },
        { status: 400 },
      );
    }

    // opslaan met prisma
    await prisma.contactSubmission.create({
      data: {
        firstName: firstName,
        lastName: lastName,
        company: company,
        email: email,
        phone: phone,
        message: message,
        agree: true,
      },
    });
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("Contact API fout:", err);
    return NextResponse.json(
      { error: "Kon het bericht niet verzenden." + err.message },
      { status: 500 },
    );
  }
}
