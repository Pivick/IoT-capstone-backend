import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOtpEmail(email: string, otp: string) {
  const { data, error } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL as string,
    to: [email],
    subject: "Your UniVentry OTP Code",
    html: `
      <div style="font-family: Arial; padding: 20px;">
        <h2>UniVentry OTP Verification</h2>
        <p>Your OTP code is:</p>

        <div style="
          font-size:32px;
          font-weight:bold;
          letter-spacing:6px;
          background:#f3f4f6;
          padding:20px;
          text-align:center;
          border-radius:10px;
          margin:20px 0;
        ">
          ${otp}
        </div>

        <p>This code expires in 10 minutes.</p>
      </div>
    `,
  });

  if (error) {
    console.error("Resend error:", error);
    throw new Error(error.message);
  }

  console.log("Email sent:", data);
}
