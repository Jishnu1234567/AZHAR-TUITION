import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      name,
      phone,
      email,
      studentClass,
      board,
      message,
    } = body;

    // Email to tuition centre
    await resend.emails.send({
      from: "Website <noreply@yourdomain.com>",
      to: process.env.TUITION_EMAIL!,
      subject: `New Admission Enquiry from ${name}`,
      html: `
        <h2>New Enquiry</h2>

        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Class:</strong> ${studentClass}</p>
        <p><strong>Board:</strong> ${board}</p>
        <p><strong>Message:</strong> ${message}</p>
      `,
    });

    // Auto reply to student
    await resend.emails.send({
      from: "Azhar's Tuition Centre <noreply@yourdomain.com>",
      to: email,
      subject: "Thank you for contacting Azhar's Tuition Centre",
      html: `
        <h2>Thank You!</h2>

        <p>Dear ${name},</p>

        <p>
          Thank you for contacting Azhar's Tuition Centre.
          We have received your enquiry and our team
          will contact you shortly.
        </p>

        <p>
          Phone: +91 XXXXX XXXXX<br/>
          Email: admissions@azhars.com
        </p>

        <p>Regards,<br/>Azhar's Tuition Centre</p>
      `,
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
      },
      { status: 500 }
    );
  }
}