import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { to, subject, html } = await req.json();

    if (!to || !subject || !html) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
      });
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    const info = await transporter.sendMail({
      from: `"Food App" <${process.env.GMAIL_USER}>`,
      to,
      subject,
      html,
    });

    return new Response(
      JSON.stringify({ message: "Email sent", id: info.messageId }),
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Email error:", err);
    return new Response(
      JSON.stringify({ error: err.message || "Failed to send email" }),
      { status: 500 }
    );
  }
}
