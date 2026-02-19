
/**
 * Welcome Email Template
 * Personalized HTML email for new BloodOS user signups.
 */
export function welcomeTemplate(userName: string = 'Donor'): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Welcome to BloodOS</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f4;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0"
               style="background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
          
          <!-- Header -->
          <tr>
            <td style="background:#dc2626;padding:32px;text-align:center;">
              <h1 style="color:#ffffff;margin:0;font-size:28px;letter-spacing:1px;">🩸 BloodOS</h1>
              <p style="color:#fca5a5;margin:8px 0 0;font-size:14px;">Connecting Lives. Saving Futures.</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 36px;">
              <h2 style="color:#1f2937;margin-top:0;">Welcome, ${userName}! 👋</h2>
              <p style="color:#4b5563;font-size:16px;line-height:1.6;">
                Thank you for joining BloodOS — a platform dedicated to bridging the gap between blood donors and those in need.
              </p>
              <p style="color:#4b5563;font-size:16px;line-height:1.6;">
                Your registration brings us one step closer to saving lives. Here's what you can do next:
              </p>
              <ul style="color:#4b5563;font-size:15px;line-height:2;">
                <li>Complete your <strong>donor profile</strong></li>
                <li>Browse <strong>blood requests</strong> near you</li>
                <li>Schedule your first <strong>donation</strong></li>
              </ul>

              <!-- CTA Button -->
              <div style="text-align:center;margin:32px 0;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard"
                   style="background:#dc2626;color:#ffffff;padding:14px 32px;
                          border-radius:6px;text-decoration:none;font-weight:bold;
                          font-size:16px;display:inline-block;">
                  Go to Dashboard →
                </a>
              </div>

              <p style="color:#6b7280;font-size:14px;">
                If you have any questions, reply to this email or contact our support team.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f9fafb;padding:24px 36px;border-top:1px solid #e5e7eb;">
              <p style="color:#9ca3af;font-size:12px;text-align:center;margin:0;">
                © ${new Date().getFullYear()} BloodOS. All rights reserved.<br/>
                <strong>Please do not reply to this email</strong> — this is an automated message.<br/>
                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/unsubscribe"
                   style="color:#dc2626;text-decoration:none;">Unsubscribe</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}
